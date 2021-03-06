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
	"github.com/mjm/courier-js/internal/db/expr"
	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	ErrNoTweet            = status.Error(codes.NotFound, "no tweet found")
	ErrCannotCancelOrPost = status.Error(codes.FailedPrecondition, "tweet does not exist or is already canceled or posted")
	ErrCannotUncancel     = status.Error(codes.FailedPrecondition, "tweet does not exist or is not currently canceled")
	ErrCannotUpdate       = status.Error(codes.FailedPrecondition, "tweet does not exist or is already canceled or posted")
	ErrCannotEnqueue      = status.Error(codes.FailedPrecondition, "tweet does not exist or is already canceled or posted")
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
	URL          string
	Tweets       []*model.Tweet
	RetweetID    string
	Autopost     bool
	PostTaskName string
}

func (r *TweetRepository) Create(ctx context.Context, ts []CreateTweetParams) error {
	if len(ts) == 0 {
		return nil
	}

	now := model.FormatTime(r.clock.Now())
	var reqs []*dynamodb.WriteRequest

	for _, params := range ts {
		pk, sk := r.primaryKeyValues(params.ID)
		published := model.FormatTime(params.PublishedAt)
		upcoming := "UPCOMING#" + published

		item := map[string]*dynamodb.AttributeValue{
			db.PK:              {S: &pk},
			db.SK:              {S: &sk},
			db.LSI1SK:          {S: &upcoming},
			db.GSI2PK:          {S: aws.String("FEED#" + string(params.ID.FeedID))},
			db.GSI2SK:          {S: aws.String(fmt.Sprintf("#POST#%s#%s##TWEET", published, params.ID.ItemID))},
			db.Type:            {S: aws.String(model.TypeTweet)},
			model.ColCreatedAt: {S: &now},
			"UpcomingKey":      {S: &upcoming},
		}

		if params.URL != "" {
			item[model.ColURL] = &dynamodb.AttributeValue{S: aws.String(params.URL)}
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

		if params.Autopost {
			postAfter := model.FormatTime(r.clock.Now().Add(5 * time.Minute))
			item[model.ColPostAfter] = &dynamodb.AttributeValue{S: aws.String(postAfter)}
			item[model.ColPostTaskName] = &dynamodb.AttributeValue{S: aws.String(params.PostTaskName)}
		}

		reqs = append(reqs, &dynamodb.WriteRequest{
			PutRequest: &dynamodb.PutRequest{
				Item: item,
			},
		})
	}

	for i := 0; i < len(reqs); i += dynamoBatchSize {
		j := i + dynamoBatchSize
		if j > len(reqs) {
			j = len(reqs)
		}

		_, err := r.dynamo.BatchWriteItemWithContext(ctx, &dynamodb.BatchWriteItemInput{
			RequestItems: map[string][]*dynamodb.WriteRequest{
				r.dynamoConfig.TableName: reqs[i:j],
			},
		})
		if err != nil {
			return err
		}
	}

	return nil
}

type UpdateTweetParams struct {
	ID        model.TweetGroupID
	URL       string
	Tweets    []*model.Tweet
	RetweetID string
}

func (r *TweetRepository) Update(ctx context.Context, params UpdateTweetParams) error {
	input := &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(params.ID),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":         aws.String(db.PK),
			"#posted_at":  aws.String(model.ColPostedAt),
			"#tweets":     aws.String(model.ColTweets),
			"#retweet_id": aws.String(model.ColRetweetID),
			"#url":        aws.String(model.ColURL),
		},
	}

	var b expr.UpdateBuilder
	b.SetString("url", params.URL)

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

		b.Set("tweets", &dynamodb.AttributeValue{L: tweets})
		b.Remove("retweet_id")
	} else {
		b.Remove("tweets")
		b.SetString("retweet_id", params.RetweetID)
	}

	b.Apply(input)

	_, err := r.dynamo.UpdateItemWithContext(ctx, input)
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotUpdate
		}
		return err
	}

	return nil
}

func (r *TweetRepository) Cancel(ctx context.Context, id model.TweetGroupID) error {
	now := model.FormatTime(r.clock.Now())

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 r.primaryKey(id),
		UpdateExpression:    aws.String(`SET #canceled_at = :canceled_at, #lsi1sk = :lsi1sk`), // TODO remove post_after and task name
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":          aws.String(db.PK),
			"#lsi1sk":      aws.String(db.LSI1SK),
			"#canceled_at": aws.String(model.ColCanceledAt),
			"#posted_at":   aws.String(model.ColPostedAt),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":canceled_at": {S: aws.String(now)},
			":lsi1sk":      {S: aws.String("PAST#" + now)},
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
		UpdateExpression:    aws.String(`REMOVE #canceled_at SET #lsi1sk = #upcoming`),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":          aws.String(db.PK),
			"#lsi1sk":      aws.String(db.LSI1SK),
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
	now := model.FormatTime(r.clock.Now())

	expr := `SET #posted_at = :posted_at, #lsi1sk = :lsi1sk`
	values := map[string]*dynamodb.AttributeValue{
		":posted_at": {S: aws.String(now)},
		":lsi1sk":    {S: aws.String("PAST#" + now)},
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
			"#lsi1sk":          aws.String(db.LSI1SK),
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

func (r *TweetRepository) PostRetweet(ctx context.Context, id model.TweetGroupID, postedTweetID int64) error {
	now := model.FormatTime(r.clock.Now())

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 id.PrimaryKey(),
		UpdateExpression:    aws.String(`SET #posted_at = :posted_at, #lsi1sk = :lsi1sk, #posted_retweet_id = :posted_retweet_id`),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":                aws.String(db.PK),
			"#lsi1sk":            aws.String(db.LSI1SK),
			"#canceled_at":       aws.String(model.ColCanceledAt),
			"#posted_at":         aws.String(model.ColPostedAt),
			"#posted_retweet_id": aws.String(model.ColPostedRetweetID),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":posted_at":         {S: aws.String(now)},
			":lsi1sk":            {S: aws.String("PAST#" + now)},
			":posted_retweet_id": {S: aws.String(strconv.FormatInt(postedTweetID, 10))},
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

func (r *TweetRepository) EnqueuePost(ctx context.Context, id model.TweetGroupID, taskName string) error {
	postAfter := model.FormatTime(r.clock.Now())

	_, err := r.dynamo.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:           &r.dynamoConfig.TableName,
		Key:                 id.PrimaryKey(),
		UpdateExpression:    aws.String(`SET #post_after = :post_after, #post_task_name = :post_task_name`),
		ConditionExpression: aws.String(`attribute_exists(#pk) and attribute_not_exists(#canceled_at) and attribute_not_exists(#posted_at)`),
		ExpressionAttributeNames: map[string]*string{
			"#pk":             aws.String(db.PK),
			"#canceled_at":    aws.String(model.ColCanceledAt),
			"#posted_at":      aws.String(model.ColPostedAt),
			"#post_after":     aws.String(model.ColPostAfter),
			"#post_task_name": aws.String(model.ColPostTaskName),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":post_after":     {S: &postAfter},
			":post_task_name": {S: &taskName},
		},
	})
	if err != nil {
		if _, ok := err.(*dynamodb.ConditionalCheckFailedException); ok {
			return ErrCannotEnqueue
		}
		return err
	}

	return nil
}

func (r *TweetRepository) PurgeByFeed(ctx context.Context, userID string, feedID model.FeedID) (int64, error) {
	var total int64

	var err2 error
	err := r.dynamo.QueryPagesWithContext(ctx, &dynamodb.QueryInput{
		TableName:              &r.dynamoConfig.TableName,
		KeyConditionExpression: aws.String(`#pk = :pk and begins_with(#sk, :sk)`),
		ProjectionExpression:   aws.String(`#pk, #sk`),
		ExpressionAttributeNames: map[string]*string{
			"#pk": aws.String(db.PK),
			"#sk": aws.String(db.SK),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {S: aws.String("USER#" + userID)},
			":sk": {S: aws.String("FEED#" + string(feedID) + "#")},
		},
	}, func(res *dynamodb.QueryOutput, lastPage bool) bool {
		var reqs []*dynamodb.WriteRequest
		for _, item := range res.Items {
			reqs = append(reqs, &dynamodb.WriteRequest{
				DeleteRequest: &dynamodb.DeleteRequest{
					Key: map[string]*dynamodb.AttributeValue{
						db.PK: item[db.PK],
						db.SK: item[db.SK],
					},
				},
			})
		}

		for i := 0; i < len(reqs); i += dynamoBatchSize {
			j := i + dynamoBatchSize
			if j > len(reqs) {
				j = len(reqs)
			}

			_, err := r.dynamo.BatchWriteItemWithContext(ctx, &dynamodb.BatchWriteItemInput{
				RequestItems: map[string][]*dynamodb.WriteRequest{
					r.dynamoConfig.TableName: reqs[i:j],
				},
			})
			if err != nil {
				err2 = err
				return false
			}
		}

		total += int64(len(res.Items))
		return true
	})
	if err2 != nil {
		return total, err2
	}
	return total, err
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
