package tweets

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

type TweetQueriesDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
	loader       *dataloader.Loader
}

func NewTweetQueriesDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *TweetQueriesDynamo {
	return &TweetQueriesDynamo{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
		loader:       newTweetLoaderDynamo(dynamo, dynamoConfig),
	}
}

func (q *TweetQueriesDynamo) Get(ctx context.Context, id model.TweetGroupID) (*model.TweetGroup, error) {
	tg, err := q.loader.Load(ctx, loader.IDKey(id))()
	if err != nil {
		return nil, err
	}

	return tg.(*model.TweetGroup), nil
}

func (q *TweetQueriesDynamo) Paged(ctx context.Context, userID string, filter Filter, opts pager.Options) (*pager.Connection, error) {
	p := &tweetPagerDynamo{
		TableName: q.dynamoConfig.TableName,
		UserID:    userID,
		Filter:    filter,
	}

	return pager.PagedDynamo(ctx, q.dynamo, p, opts)
}

func newTweetLoaderDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *dataloader.Loader {
	return loader.New("TweetLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		userID, err := auth.GetUser(ctx).ID()
		if err != nil {
			return nil
		}

		var ks []map[string]*dynamodb.AttributeValue
		var ids []model.TweetGroupID
		for _, k := range keys {
			id := k.Raw().(model.TweetGroupID)
			ks = append(ks, id.PrimaryKey())
			ids = append(ids, id)
		}

		res, err := dynamo.BatchGetItemWithContext(ctx, &dynamodb.BatchGetItemInput{
			RequestItems: map[string]*dynamodb.KeysAndAttributes{
				dynamoConfig.TableName: {Keys: ks},
			},
		})
		if err != nil {
			panic(err)
		}

		results := make(map[model.TweetGroupID]*dataloader.Result)
		for _, item := range res.Responses[dynamoConfig.TableName] {
			tg, err := model.NewTweetGroupFromAttrs(item)
			if err != nil {
				// TODO parse the ID and set an error here
				continue
			}

			if tg.UserID() != userID {
				results[tg.ID] = &dataloader.Result{Error: ErrNoTweet}
				continue
			}

			results[tg.ID] = &dataloader.Result{Data: tg}
		}

		var rows []*dataloader.Result
		for _, id := range ids {
			if res, ok := results[id]; ok {
				rows = append(rows, res)
			} else {
				rows = append(rows, &dataloader.Result{
					Error: ErrNoTweet,
				})
			}
		}

		return rows
	})
}
