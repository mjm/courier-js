package shared

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	ErrNoFeed = status.Error(codes.NotFound, "no feed found")
)

type FeedRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewFeedRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *FeedRepository {
	return &FeedRepository{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
	}
}

func (r *FeedRepository) Get(ctx context.Context, userID string, feedID model.FeedID) (*model.Feed, error) {
	res, err := r.dynamo.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: &r.dynamoConfig.TableName,
		Key:       r.primaryKey(userID, feedID),
	})
	if err != nil {
		return nil, err
	}

	if res.Item == nil {
		return nil, ErrNoFeed
	}

	return model.NewFeedFromAttrs(res.Item)
}

type FeedWithItems struct {
	model.Feed
	Posts []*PostWithTweetGroup
}

type PostWithTweetGroup struct {
	model.Post
	TweetGroup *model.TweetGroup
}

func (r *FeedRepository) GetWithRecentItems(ctx context.Context, feedID model.FeedID, lastPublished *time.Time) (*FeedWithItems, error) {
	pk := "FEED#" + string(feedID)

	input := &dynamodb.QueryInput{
		TableName:              &r.dynamoConfig.TableName,
		IndexName:              aws.String(db.GSI2),
		KeyConditionExpression: aws.String(`#pk = :pk`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.GSI2PK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: &pk},
		},
		ScanIndexForward: aws.Bool(false),
	}

	if lastPublished == nil {
		// 1 feed + 10 posts + 10 tweet groups = 21 items
		input.SetLimit(21)
	} else {
		sk := fmt.Sprintf("#POST#%s#Z", lastPublished.Format(time.RFC3339))
		input.SetKeyConditionExpression(`#pk = :pk and #sk >= :sk`)
		input.ExpressionAttributeNames["#sk"] = aws.String(db.GSI2SK)
		input.ExpressionAttributeValues[":sk"] = &dynamodb.AttributeValue{S: &sk}
	}

	res, err := r.dynamo.QueryWithContext(ctx, input)
	if err != nil {
		return nil, err
	}

	if len(res.Items) < 1 {
		return nil, ErrNoFeed
	}

	feed, err := model.NewFeedFromAttrs(res.Items[0])
	if err != nil {
		return nil, err
	}

	result := &FeedWithItems{
		Feed: *feed,
	}

	for _, item := range res.Items[1:] {
		switch aws.StringValue(item[db.Type].S) {
		case model.TypePost:
			if len(result.Posts) == 10 {
				break
			}

			post, err := model.NewPostFromAttrs(item)
			if err != nil {
				return nil, err
			}

			result.Posts = append(result.Posts, &PostWithTweetGroup{
				Post: *post,
			})
		case model.TypeTweet:
			tg, err := model.NewTweetGroupFromAttrs(item)
			if err != nil {
				return nil, err
			}

			if len(result.Posts) == 0 {
				continue
			}

			post := result.Posts[len(result.Posts)-1]
			if post.ItemID() != tg.ItemID() {
				continue
			}

			post.TweetGroup = tg
		}
	}

	return result, nil
}

func (r *FeedRepository) Create(ctx context.Context, userID string, feedID model.FeedID, url string) error {
	pk, sk := r.primaryKeyValues(userID, feedID)
	now := time.Now().Format(time.RFC3339)
	_, err := r.dynamo.PutItemWithContext(ctx, &dynamodb.PutItemInput{
		TableName: &r.dynamoConfig.TableName,
		Item: map[string]*dynamodb.AttributeValue{
			db.PK:              {S: &pk},
			db.SK:              {S: &sk},
			db.GSI1PK:          {S: &pk},
			db.GSI1SK:          {S: aws.String("FEED#")},
			db.GSI2PK:          {S: &sk},
			db.GSI2SK:          {S: &sk},
			db.Type:            {S: aws.String(model.TypeFeed)},
			model.ColURL:       {S: &url},
			model.ColAutopost:  {BOOL: aws.Bool(false)},
			model.ColCreatedAt: {S: &now},
			model.ColUpdatedAt: {S: &now},
		},
		ConditionExpression: aws.String("attribute_not_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
		},
	})
	if err != nil {
		return err
	}

	return nil
}

type UpdateFeedParams struct {
	ID     model.FeedID
	UserID string

	Title            string
	HomePageURL      string
	CachingHeaders   *model.CachingHeaders
	MicropubEndpoint string
}

func (r *FeedRepository) UpdateDetails(ctx context.Context, params UpdateFeedParams) error {
	var toSet []string
	var toRemove []string
	vals := map[string]*dynamodb.AttributeValue{}

	setString := func(col string, val string) {
		if val != "" {
			toSet = append(toSet, fmt.Sprintf("#%s = :%s", col, col))
			vals[":"+col] = &dynamodb.AttributeValue{S: aws.String(val)}
		} else {
			toRemove = append(toRemove, "#"+col)
		}
	}

	setString("title", params.Title)
	setString("gsi1sk", "FEED#"+params.Title)
	setString("home", params.HomePageURL)
	setString("mp", params.MicropubEndpoint)

	if params.CachingHeaders != nil {
		toSet = append(toSet, "#ch = :ch")
		ch := map[string]*dynamodb.AttributeValue{}
		if params.CachingHeaders.Etag != "" {
			ch[model.ColEtag] = &dynamodb.AttributeValue{S: aws.String(params.CachingHeaders.Etag)}
		}
		if params.CachingHeaders.LastModified != "" {
			ch[model.ColLastModified] = &dynamodb.AttributeValue{S: aws.String(params.CachingHeaders.LastModified)}
		}
		vals[":ch"] = &dynamodb.AttributeValue{M: ch}
	} else {
		toRemove = append(toRemove, "#ch")
	}

	var expr string
	if len(toSet) > 0 {
		expr += "SET " + strings.Join(toSet, ", ") + " "
	} else {
		vals = nil
	}
	if len(toRemove) > 0 {
		expr += "REMOVE " + strings.Join(toRemove, ", ") + " "
	}

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.UserID, params.ID),
		UpdateExpression:    &expr,
		ConditionExpression: aws.String("attribute_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk":     aws.String(db.PK),
			"#gsi1sk": aws.String(db.GSI1SK),
			"#title":  aws.String(model.ColTitle),
			"#home":   aws.String(model.ColHomePageURL),
			"#ch":     aws.String(model.ColCachingHeaders),
			"#mp":     aws.String(model.ColMicropubEndpoint),
		},
		ExpressionAttributeValues: vals,
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrNoFeed
		}
		return err
	}

	return nil
}

type UpdateFeedSettingsParams struct {
	ID     model.FeedID
	UserID string

	Autopost bool
}

func (r *FeedRepository) UpdateSettings(ctx context.Context, params UpdateFeedSettingsParams) error {
	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.UserID, params.ID),
		UpdateExpression:    aws.String(`SET #autopost = :autopost`),
		ConditionExpression: aws.String("attribute_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk":       aws.String(db.PK),
			"#autopost": aws.String(model.ColAutopost),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":autopost": {BOOL: aws.Bool(params.Autopost)},
		},
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrNoFeed
		}
		return err
	}

	return nil
}

func (r *FeedRepository) primaryKeyValues(userID string, feedID model.FeedID) (string, string) {
	pk := fmt.Sprintf("USER#%s", userID)
	sk := fmt.Sprintf("FEED#%s", feedID)
	return pk, sk
}

func (r *FeedRepository) primaryKey(userID string, feedID model.FeedID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(userID, feedID)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}
