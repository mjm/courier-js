package tweets

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

type TweetQueriesDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewTweetQueriesDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *TweetQueriesDynamo {
	return &TweetQueriesDynamo{dynamo: dynamo, dynamoConfig: dynamoConfig}
}

func (q *TweetQueriesDynamo) Paged(ctx context.Context, userID string, filter Filter, opts pager.Options) (*pager.Connection, error) {
	p := &tweetPagerDynamo{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
		Filter:    filter,
	}

	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}
