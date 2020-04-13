package shared

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/feeds"
)

var (
	ErrNoTweet      = status.Error(codes.NotFound, "no tweet found")
	ErrCannotCancel = status.Error(codes.FailedPrecondition, "tweet does not exist or is already canceled or posted")
)

const (
	colTweets        = "Tweets"
	colRetweetID     = "RetweetID"
	colPostedAt      = "PostedAt"
	colCanceledAt    = "CanceledAt"
	colBody          = "Body"
	colMediaURLs     = "MediaURLs"
	colPostedTweetID = "PostedTweetID"
)

type TweetRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewTweetRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *TweetRepository {
	return &TweetRepository{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
	}
}

func (r *TweetRepository) Get(ctx context.Context, userID string, feedID feeds.FeedID, postID feeds.PostID) (*TweetGroup, error) {
	res, err := r.dynamo.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: &r.dynamoConfig.TableName,
		Key:       r.primaryKey(userID, feedID, postID),
	})
	if err != nil {
		return nil, err
	}

	if res.Item == nil {
		return nil, ErrNoTweet
	}

	return newTweetGroupFromAttrs(res.Item)
}

type CreateTweetParams struct {
	FeedID       feeds.FeedID
	PostID       feeds.PostID
	PublishedAt  time.Time
	Tweets       []*Tweet
	RetweetID    string
	PostTaskName string
}

func (r *TweetRepository) Create(ctx context.Context, userID string, ts []CreateTweetParams) error {
	if len(ts) == 0 {
		return nil
	}

	now := time.Now().Format(time.RFC3339)
	var reqs []*dynamodb.WriteRequest

	for _, params := range ts {
		pk, sk := r.primaryKeyValues(userID, params.FeedID, params.PostID)

		item := map[string]*dynamodb.AttributeValue{
			db.PK: {S: &pk},
			db.SK: {S: &sk},
			// TODO GSI1
			colCreatedAt: {S: &now},
		}

		if len(params.Tweets) > 0 {
			var tweets []*dynamodb.AttributeValue
			for _, t := range params.Tweets {
				tweetAttrs := map[string]*dynamodb.AttributeValue{}
				if t.Body != "" {
					tweetAttrs[colBody] = &dynamodb.AttributeValue{S: aws.String(t.Body)}
				}
				if len(t.MediaURLs) > 0 {
					var urls []*dynamodb.AttributeValue
					for _, u := range t.MediaURLs {
						urls = append(urls, &dynamodb.AttributeValue{S: aws.String(u)})
					}
					tweetAttrs[colMediaURLs] = &dynamodb.AttributeValue{L: urls}
				}
				// if t.PostedTweetID != "" {
				// 	tweetAttrs[colPostedTweetID] = &dynamodb.AttributeValue{S: aws.String(t.PostedTweetID)}
				// }
				tweets = append(tweets, &dynamodb.AttributeValue{M: tweetAttrs})
			}
			item[colTweets] = &dynamodb.AttributeValue{L: tweets}
		}

		if params.RetweetID != "" {
			item[colRetweetID] = &dynamodb.AttributeValue{S: aws.String(params.RetweetID)}
		}

		// TODO post task name and post after

		reqs = append(reqs, &dynamodb.WriteRequest{
			PutRequest: &dynamodb.PutRequest{
				Item: item,
			},
		})
	}

	_, err := r.dynamo.BatchWriteItemWithContext(ctx, &dynamodb.BatchWriteItemInput{
		RequestItems: map[string][]*dynamodb.WriteRequest{
			r.dynamoConfig.TableName: reqs,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *TweetRepository) Cancel(ctx context.Context, userID string, feedID feeds.FeedID, postID feeds.PostID) error {
	now := time.Now().Format(time.RFC3339)

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(userID, feedID, postID),
		UpdateExpression:    aws.String(`SET #canceled_at = :canceled_at`), // TODO remove post_after and task name
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":          aws.String(db.PK),
			"#canceled_at": aws.String(colCanceledAt),
			"#posted_at":   aws.String(colPostedAt),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":canceled_at": {S: aws.String(now)},
		},
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotCancel
		}
		return err
	}

	return nil
}

func (r *TweetRepository) primaryKeyValues(userID string, feedID feeds.FeedID, postID feeds.PostID) (string, string) {
	pk := "USER#" + userID
	sk := fmt.Sprintf("FEED#%s#TWEETGROUP#%s", feedID, postID)
	return pk, sk
}

func (r *TweetRepository) primaryKey(userID string, feedID feeds.FeedID, postID feeds.PostID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(userID, feedID, postID)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}
