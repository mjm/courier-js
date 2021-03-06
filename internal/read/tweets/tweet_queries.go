package tweets

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/graph-gophers/dataloader"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = status.Error(codes.NotFound, "no tweet found")
)

type TweetQueries struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	loader       *dataloader.Loader
}

func NewTweetQueries(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *TweetQueries {
	return &TweetQueries{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		loader:       newTweetLoader(dynamo, dynamoConfig),
	}
}

func (q *TweetQueries) Get(ctx context.Context, id model.TweetGroupID) (*model.TweetGroup, error) {
	tg, err := q.loader.Load(ctx, loader.IDKey(id))()
	if err != nil {
		return nil, err
	}

	return tg.(*model.TweetGroup), nil
}

func (q *TweetQueries) Paged(ctx context.Context, userID string, filter Filter, opts pager.Options) (*pager.Connection, error) {
	p := &tweetPager{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
		Filter:    filter,
	}

	return pager.Paged(ctx, q.dynamo, p, opts)
}

func newTweetLoader(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *dataloader.Loader {
	return loader.New("TweetLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		userID, err := auth.GetUser(ctx).ID()
		if err != nil {
			return nil
		}

		return loader.BatchLoad(ctx, dynamo, dynamoConfig, keys, func(item map[string]*dynamodb.AttributeValue) (interface{}, loader.ID, error) {
			tg, err := model.NewTweetGroupFromAttrs(item)
			if err != nil {
				return nil, nil, err
			}

			if tg.UserID() != userID {
				return nil, tg.ID, ErrNoTweet
			}

			return tg, tg.ID, nil
		})
	})
}
