package feeds

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/graph-gophers/dataloader"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/shared/model"
)

type PostQueriesDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	loader       *dataloader.Loader
}

func NewPostQueriesDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *PostQueriesDynamo {
	return &PostQueriesDynamo{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		loader:       newPostLoaderDynamo(dynamo, dynamoConfig),
	}
}

func (q *PostQueriesDynamo) Get(ctx context.Context, id model.PostID) (*model.Post, error) {
	p, err := q.loader.Load(ctx, loader.IDKey(id))()
	if err != nil {
		return nil, err
	}

	return p.(*model.Post), nil
}

func (q *PostQueriesDynamo) Paged(ctx context.Context, feedID model.FeedID, opts pager.Options) (*pager.Connection, error) {
	p := &postPagerDynamo{
		TableName: q.dynamoConfig.TableName,
		FeedID:    feedID,
	}

	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}

func newPostLoaderDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *dataloader.Loader {
	return loader.New("PostLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		return loader.BatchLoad(ctx, dynamo, dynamoConfig, keys, func(item map[string]*dynamodb.AttributeValue) (interface{}, loader.ID, error) {
			p, err := model.NewPostFromAttrs(item)
			if err != nil {
				return nil, nil, err
			}

			return p, p.ID, nil
		})
	})
}
