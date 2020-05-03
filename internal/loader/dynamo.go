package loader

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/graph-gophers/dataloader"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/db"
)

var (
	ErrNotFound = status.Error(codes.NotFound, "item not found")
)

func BatchLoad(
	ctx context.Context,
	dynamo dynamodbiface.DynamoDBAPI,
	dynamoConfig db.DynamoConfig,
	keys dataloader.Keys,
	processFn func(item map[string]*dynamodb.AttributeValue) (interface{}, ID, error)) []*dataloader.Result {

	var ks []map[string]*dynamodb.AttributeValue
	var ids []ID
	seen := make(map[ID]struct{})
	for _, k := range keys {
		id := k.Raw().(ID)
		ids = append(ids, id)

		// can't reuse an ID in the same request
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		ks = append(ks, id.PrimaryKey())
	}

	res, err := dynamo.BatchGetItemWithContext(ctx, &dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			dynamoConfig.TableName: {Keys: ks},
		},
	})
	if err != nil {
		panic(err)
	}

	results := make(map[ID]*dataloader.Result)
	for _, item := range res.Responses[dynamoConfig.TableName] {
		data, id, err := processFn(item)
		if id == nil {
			continue
		}
		if err != nil {
			results[id] = &dataloader.Result{Error: err}
			continue
		}

		if data != nil {
			results[id] = &dataloader.Result{Data: data}
		}
	}

	var rows []*dataloader.Result
	for _, id := range ids {
		if res, ok := results[id]; ok {
			rows = append(rows, res)
		} else {
			rows = append(rows, &dataloader.Result{
				Error: ErrNotFound,
			})
		}
	}

	return rows
}
