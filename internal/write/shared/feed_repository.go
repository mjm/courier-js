package shared

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/jonboulle/clockwork"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/db/expr"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/pkg/scraper"
)

var (
	ErrNoFeed          = status.Error(codes.NotFound, "no feed found")
	ErrExistingFeedID  = status.Error(codes.FailedPrecondition, "feed with ID already exists")
	ErrExistingFeedURL = status.Error(codes.FailedPrecondition, "feed with URL already exists")
)

type FeedRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	clock        clockwork.Clock
}

func NewFeedRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig, clock clockwork.Clock) *FeedRepository {
	return &FeedRepository{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		clock:        clock,
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

func (r *FeedRepository) ByHomePageURL(ctx context.Context, u string) ([]*model.Feed, error) {
	u = scraper.NormalizeURL(u)

	res, err := r.dynamo.QueryWithContext(ctx, &dynamodb.QueryInput{
		TableName:              &r.dynamoConfig.TableName,
		IndexName:              aws.String(db.GSI1),
		KeyConditionExpression: aws.String(`#pk = :pk`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.GSI1PK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: aws.String("HOMEPAGE#" + u)},
		},
	})
	if err != nil {
		return nil, err
	}

	var fs []*model.Feed
	for _, item := range res.Items {
		f, err := model.NewFeedFromAttrs(item)
		if err != nil {
			return nil, err
		}
		fs = append(fs, f)
	}
	return fs, nil
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
		sk := fmt.Sprintf("#POST#%s#Z", model.FormatTime(*lastPublished))
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
			// if we're only fetching the most recent 10 posts, we might overfetch, so we should stop
			// once we have as many posts as we expect.
			if lastPublished == nil && len(result.Posts) == 10 {
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
	id := model.UserFeedID{
		UserID: userID,
		FeedID: feedID,
	}
	pk, sk := id.PrimaryKeyValues()
	urlSK := "FEEDURL#" + url

	now := model.FormatTime(r.clock.Now())
	_, err := r.dynamo.TransactWriteItemsWithContext(ctx, &dynamodb.TransactWriteItemsInput{
		TransactItems: []*dynamodb.TransactWriteItem{
			{
				Put: &dynamodb.Put{
					TableName: &r.dynamoConfig.TableName,
					Item: map[string]*dynamodb.AttributeValue{
						db.PK:              {S: &pk},
						db.SK:              {S: &sk},
						db.LSI1SK:          {S: aws.String("FEED#")},
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
				},
			},
			{
				Put: &dynamodb.Put{
					TableName: &r.dynamoConfig.TableName,
					Item: map[string]*dynamodb.AttributeValue{
						db.PK:    {S: &pk},
						db.SK:    {S: &urlSK},
						"FeedID": {S: aws.String(string(feedID))},
					},
					ConditionExpression: aws.String(`attribute_not_exists(#pk)`),
					ExpressionAttributeNames: map[string]*string{
						"#pk": aws.String(db.PK),
					},
				},
			},
		},
	})
	if err != nil {
		if err, ok := err.(*dynamodb.TransactionCanceledException); ok {
			if len(err.CancellationReasons) == 2 {
				if aws.StringValue(err.CancellationReasons[0].Code) == "ConditionalCheckFailed" {
					return ErrExistingFeedID
				}
				if aws.StringValue(err.CancellationReasons[1].Code) == "ConditionalCheckFailed" {
					return ErrExistingFeedURL
				}
			}
		}
		return err
	}

	return nil
}

func (r *FeedRepository) EnqueueRefresh(ctx context.Context, userID string, feedID model.FeedID, taskName string) error {
	id := model.UserFeedID{
		UserID: userID,
		FeedID: feedID,
	}

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 id.PrimaryKey(),
		UpdateExpression:    aws.String(`SET #refresh_task_name = :refresh_task_name`),
		ConditionExpression: aws.String(`attribute_exists(#pk)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":                aws.String(db.PK),
			"#refresh_task_name": aws.String(model.ColRefreshTaskName),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":refresh_task_name": {S: aws.String(taskName)},
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

type UpdateFeedParams struct {
	ID     model.FeedID
	UserID string

	Title            string
	HomePageURL      string
	CachingHeaders   *model.CachingHeaders
	MicropubEndpoint string
}

func (r *FeedRepository) UpdateDetails(ctx context.Context, params UpdateFeedParams) error {
	input := &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.UserID, params.ID),
		ConditionExpression: aws.String("attribute_exists(#pk)"),
		ExpressionAttributeNames: map[string]*string{
			"#pk":                aws.String(db.PK),
			"#lsi1sk":            aws.String(db.LSI1SK),
			"#gsi1pk":            aws.String(db.GSI1PK),
			"#gsi1sk":            aws.String(db.GSI1SK),
			"#title":             aws.String(model.ColTitle),
			"#home":              aws.String(model.ColHomePageURL),
			"#ch":                aws.String(model.ColCachingHeaders),
			"#mp":                aws.String(model.ColMicropubEndpoint),
			"#refreshed_at":      aws.String(model.ColRefreshedAt),
			"#refresh_task_name": aws.String(model.ColRefreshTaskName),
		},
	}

	var b expr.UpdateBuilder

	b.SetString("title", params.Title)
	b.SetString("lsi1sk", "FEED#"+params.Title)
	homeURL := scraper.NormalizeURL(params.HomePageURL)
	b.SetString("home", homeURL)
	b.SetString("gsi1pk", "HOMEPAGE#"+homeURL)
	b.SetString("gsi1sk", "FEED#"+string(params.ID))
	b.SetString("mp", params.MicropubEndpoint)

	b.SetString("refreshed_at", model.FormatTime(r.clock.Now()))
	b.Remove("refresh_task_name")

	if params.CachingHeaders != nil {
		ch := map[string]*dynamodb.AttributeValue{}
		if params.CachingHeaders.Etag != "" {
			ch[model.ColEtag] = &dynamodb.AttributeValue{S: aws.String(params.CachingHeaders.Etag)}
		}
		if params.CachingHeaders.LastModified != "" {
			ch[model.ColLastModified] = &dynamodb.AttributeValue{S: aws.String(params.CachingHeaders.LastModified)}
		}

		b.Set("ch", &dynamodb.AttributeValue{M: ch})
	} else {
		b.Remove("ch")
	}

	b.Apply(input)

	_, err := r.dynamo.UpdateItemWithContext(ctx, input)
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

func (r *FeedRepository) Deactivate(ctx context.Context, userID string, feedID model.FeedID) error {
	now := model.FormatTime(r.clock.Now())

	id := model.UserFeedID{
		UserID: userID,
		FeedID: feedID,
	}

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 id.PrimaryKey(),
		UpdateExpression:    aws.String(`SET #deactivated_at = :deactivated_at REMOVE #lsi1sk`),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#deactivated_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":             aws.String(db.PK),
			"#lsi1sk":         aws.String(db.LSI1SK),
			"#deactivated_at": aws.String(model.ColDeactivatedAt),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":deactivated_at": {S: aws.String(now)},
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

func (r *FeedRepository) Delete(ctx context.Context, userID string, feedID model.FeedID) error {
	id := model.UserFeedID{
		UserID: userID,
		FeedID: feedID,
	}

	res, err := r.dynamo.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName:            &r.dynamoConfig.TableName,
		Key:                  id.PrimaryKey(),
		ProjectionExpression: aws.String(`#pk, #sk, #url`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":  aws.String(db.PK),
			"#sk":  aws.String(db.SK),
			"#url": aws.String(model.ColURL),
		},
	})
	if err != nil {
		return err
	}

	if res.Item == nil {
		return nil
	}

	_, err = r.dynamo.BatchWriteItemWithContext(ctx, &dynamodb.BatchWriteItemInput{
		RequestItems: map[string][]*dynamodb.WriteRequest{
			r.dynamoConfig.TableName: {
				{
					DeleteRequest: &dynamodb.DeleteRequest{
						Key: id.PrimaryKey(),
					},
				},
				{
					DeleteRequest: &dynamodb.DeleteRequest{
						Key: map[string]*dynamodb.AttributeValue{
							db.PK: res.Item[db.PK],
							db.SK: {S: aws.String("FEEDURL#" + aws.StringValue(res.Item[model.ColURL].S))},
						},
					},
				},
			},
		},
	})

	return err
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
