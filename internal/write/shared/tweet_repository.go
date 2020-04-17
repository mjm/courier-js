package shared

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/jonboulle/clockwork"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	ErrNoTweet            = status.Error(codes.NotFound, "no tweet found")
	ErrCannotCancelOrPost = status.Error(codes.FailedPrecondition, "tweet does not exist or is already canceled or posted")
	ErrCannotUncancel     = status.Error(codes.FailedPrecondition, "tweet does not exist or is not currently canceled")
)

type TweetRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	clock        clockwork.Clock
}

func NewTweetRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig, clock clockwork.Clock) *TweetRepository {
	return &TweetRepository{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		clock:        clock,
	}
}

func (r *TweetRepository) Get(ctx context.Context, id model.TweetGroupID) (*model.TweetGroup, error) {
	res, err := r.dynamo.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: &r.dynamoConfig.TableName,
		Key:       r.primaryKey(id),
	})
	if err != nil {
		return nil, err
	}

	if res.Item == nil {
		return nil, ErrNoTweet
	}

	return model.NewTweetGroupFromAttrs(res.Item)
}

type CreateTweetParams struct {
	ID           model.TweetGroupID
	PublishedAt  time.Time
	Tweets       []*model.Tweet
	RetweetID    string
	PostTaskName string
}

func (r *TweetRepository) Create(ctx context.Context, ts []CreateTweetParams) error {
	if len(ts) == 0 {
		return nil
	}

	now := r.clock.Now().Format(time.RFC3339)
	var reqs []*dynamodb.WriteRequest

	for _, params := range ts {
		pk, sk := r.primaryKeyValues(params.ID)
		published := params.PublishedAt.Format(time.RFC3339)
		upcoming := "UPCOMING#" + published

		item := map[string]*dynamodb.AttributeValue{
			db.PK:              {S: &pk},
			db.SK:              {S: &sk},
			db.GSI1PK:          {S: &pk},
			db.GSI1SK:          {S: &upcoming},
			db.GSI2PK:          {S: aws.String("FEED#" + string(params.ID.FeedID))},
			db.GSI2SK:          {S: aws.String(fmt.Sprintf("#POST#%s#%s##TWEET", published, params.ID.ItemID))},
			db.Type:            {S: aws.String(model.TypeTweet)},
			model.ColCreatedAt: {S: &now},
			"UpcomingKey":      {S: &upcoming},
		}

		if len(params.Tweets) > 0 {
			var tweets []*dynamodb.AttributeValue
			for _, t := range params.Tweets {
				tweetAttrs := map[string]*dynamodb.AttributeValue{}
				if t.Body != "" {
					tweetAttrs[model.ColBody] = &dynamodb.AttributeValue{S: aws.String(t.Body)}
				}
				if len(t.MediaURLs) > 0 {
					var urls []*dynamodb.AttributeValue
					for _, u := range t.MediaURLs {
						urls = append(urls, &dynamodb.AttributeValue{S: aws.String(u)})
					}
					tweetAttrs[model.ColMediaURLs] = &dynamodb.AttributeValue{L: urls}
				}
				tweets = append(tweets, &dynamodb.AttributeValue{M: tweetAttrs})
			}
			item[model.ColTweets] = &dynamodb.AttributeValue{L: tweets}
		}

		if params.RetweetID != "" {
			item[model.ColRetweetID] = &dynamodb.AttributeValue{S: aws.String(params.RetweetID)}
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

func (r *TweetRepository) Cancel(ctx context.Context, id model.TweetGroupID) error {
	now := r.clock.Now().Format(time.RFC3339)

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(id),
		UpdateExpression:    aws.String(`SET #canceled_at = :canceled_at, #gsi1sk = :gsi1sk`), // TODO remove post_after and task name
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":          aws.String(db.PK),
			"#gsi1sk":      aws.String(db.GSI1SK),
			"#canceled_at": aws.String(model.ColCanceledAt),
			"#posted_at":   aws.String(model.ColPostedAt),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":canceled_at": {S: aws.String(now)},
			":gsi1sk":      {S: aws.String("PAST#" + now)},
		},
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotCancelOrPost
		}
		return err
	}

	return nil
}

func (r *TweetRepository) Uncancel(ctx context.Context, id model.TweetGroupID) error {
	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(id),
		UpdateExpression:    aws.String(`REMOVE #canceled_at SET #gsi1sk = #upcoming`),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":          aws.String(db.PK),
			"#gsi1sk":      aws.String(db.GSI1SK),
			"#upcoming":    aws.String("UpcomingKey"),
			"#canceled_at": aws.String(model.ColCanceledAt),
			"#posted_at":   aws.String(model.ColPostedAt),
		},
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotUncancel
		}
		return err
	}

	return nil
}

func (r *TweetRepository) Post(ctx context.Context, id model.TweetGroupID, postedTweetIDs []int64) error {
	now := r.clock.Now().Format(time.RFC3339)

	expr := `SET #posted_at = :posted_at, #gsi1sk = :gsi1sk`
	values := map[string]*dynamodb.AttributeValue{
		":posted_at": {S: aws.String(now)},
		":gsi1sk":    {S: aws.String("PAST#" + now)},
	}

	for i, tweetID := range postedTweetIDs {
		key := fmt.Sprintf(":tweet%d_id", i)
		expr += fmt.Sprintf(", #tweets[%d].#posted_tweet_id = %s", i, key)
		values[key] = &dynamodb.AttributeValue{S: aws.String(strconv.FormatInt(tweetID, 10))}
	}

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(id),
		UpdateExpression:    &expr,
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":              aws.String(db.PK),
			"#gsi1sk":          aws.String(db.GSI1SK),
			"#canceled_at":     aws.String(model.ColCanceledAt),
			"#posted_at":       aws.String(model.ColPostedAt),
			"#tweets":          aws.String(model.ColTweets),
			"#posted_tweet_id": aws.String(model.ColPostedTweetID),
		},
		ExpressionAttributeValues: values,
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotCancelOrPost
		}
		return err
	}

	return nil
}

func (r *TweetRepository) primaryKeyValues(id model.TweetGroupID) (string, string) {
	pk := "USER#" + id.UserID
	sk := fmt.Sprintf("FEED#%s#TWEETGROUP#%s", id.FeedID, id.ItemID)
	return pk, sk
}

func (r *TweetRepository) primaryKey(id model.TweetGroupID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(id)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}
