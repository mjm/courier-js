package feeds

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

type FeedQueriesDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewFeedQueriesDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *FeedQueriesDynamo {
	return &FeedQueriesDynamo{dynamo: dynamo, dynamoConfig: dynamoConfig}
}

func (q *FeedQueriesDynamo) Paged(ctx context.Context, userID string, opts pager.Options) (*pager.Connection, error) {
	p := &feedPager{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
	}
	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}
