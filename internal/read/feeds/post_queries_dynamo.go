package feeds

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/graph-gophers/dataloader"

	"github.com/mjm/courier-js/internal/db"
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
	}
}

func (q *PostQueriesDynamo) Paged(ctx context.Context, feedID model.FeedID, opts pager.Options) (*pager.Connection, error) {
	p := &postPagerDynamo{
		TableName: q.dynamoConfig.TableName,
		FeedID:    feedID,
	}

	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}
