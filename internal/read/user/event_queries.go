package user

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

type EventQueries struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewEventQueries(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *EventQueries {
	return &EventQueries{dynamo: dynamo, dynamoConfig: dynamoConfig}
}

func (q *EventQueries) Paged(ctx context.Context, userID string, opts pager.Options) (*pager.Connection, error) {
	p := &eventPager{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
	}

	return pager.Paged(ctx, q.dynamo, p, opts)
}
