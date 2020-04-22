package feeds

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/graph-gophers/dataloader"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type FeedQueries struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	loader       *dataloader.Loader
}

func NewFeedQueries(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *FeedQueries {
	return &FeedQueries{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		loader:       newFeedLoader(dynamo, dynamoConfig),
	}
}

func (q *FeedQueries) Get(ctx context.Context, feedID model.FeedID) (*model.Feed, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	id := model.UserFeedID{
		UserID: userID,
		FeedID: feedID,
	}

	f, err := q.loader.Load(ctx, loader.IDKey(id))()
	if err != nil {
		return nil, err
	}

	return f.(*model.Feed), nil
}

func (q *FeedQueries) Paged(ctx context.Context, userID string, opts pager.Options) (*pager.Connection, error) {
	p := &feedPager{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
	}
	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}

func newFeedLoader(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *dataloader.Loader {
	return loader.New("FeedLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		return loader.BatchLoad(ctx, dynamo, dynamoConfig, keys, func(item map[string]*dynamodb.AttributeValue) (interface{}, loader.ID, error) {
			f, err := model.NewFeedFromAttrs(item)
			if err != nil {
				return nil, nil, err
			}

			id := model.UserFeedID{
				UserID: f.UserID,
				FeedID: f.ID,
			}

			return f, id, nil
		})
	})
}
