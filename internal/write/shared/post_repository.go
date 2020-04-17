package shared

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/model"
)

type PostRepository struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewPostRepository(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *PostRepository {
	return &PostRepository{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
	}
}

func (r *PostRepository) FindByItemIDs(ctx context.Context, feedID model.FeedID, itemIDs []string) ([]*model.Post, error) {
	var keys dynamodb.KeysAndAttributes
	var ids []model.PostID
	for _, itemID := range itemIDs {
		postID := model.PostID{
			FeedID: feedID,
			ItemID: itemID,
		}
		keys.Keys = append(keys.Keys, r.primaryKey(postID))
		ids = append(ids, postID)
	}

	posts := make(map[model.PostID]*model.Post)
	var err2 error
	err := r.dynamo.BatchGetItemPagesWithContext(ctx, &dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			r.dynamoConfig.TableName: &keys,
		},
	}, func(page *dynamodb.BatchGetItemOutput, lastPage bool) bool {
		for _, item := range page.Responses[r.dynamoConfig.TableName] {
			post, err := model.NewPostFromAttrs(item)
			if err != nil {
				err2 = err
				return false
			}

			posts[post.ID] = post
		}
		return true
	})

	if err != nil {
		return nil, err
	}
	if err2 != nil {
		return nil, err2
	}

	var ps []*model.Post
	for _, id := range ids {
		if p, ok := posts[id]; ok {
			ps = append(ps, p)
		}
	}

	return ps, nil
}

type WritePostParams struct {
	ID          model.PostID
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
}

func (r *PostRepository) Write(ctx context.Context, ps []WritePostParams) error {
	now := time.Now().Format(time.RFC3339)
	var reqs []*dynamodb.WriteRequest

	for _, p := range ps {
		pk, sk := r.primaryKeyValues(p.ID)

		var pubStr string
		if p.PublishedAt != nil {
			pubStr = p.PublishedAt.Format(time.RFC3339)
		}
		gsi1sk := fmt.Sprintf("POST#%s", pubStr)
		gsi2sk := fmt.Sprintf("#POST#%s#%s#ITEM", pubStr, p.ID.ItemID)

		item := map[string]*dynamodb.AttributeValue{
			db.PK:              {S: &pk},
			db.SK:              {S: &sk},
			db.GSI1PK:          {S: &pk},
			db.GSI1SK:          {S: &gsi1sk},
			db.GSI2PK:          {S: &pk},
			db.GSI2SK:          {S: &gsi2sk},
			db.Type:            {S: aws.String(model.TypePost)},
			model.ColURL:       {S: aws.String(p.URL)},
			model.ColCreatedAt: {S: &now},
			// TODO figure out how to handle updated at if we care
		}
		if p.TextContent != "" {
			item[model.ColTextContent] = &dynamodb.AttributeValue{S: aws.String(p.TextContent)}
		}
		if p.HTMLContent != "" {
			item[model.ColHTMLContent] = &dynamodb.AttributeValue{S: aws.String(p.HTMLContent)}
		}
		if p.Title != "" {
			item[model.ColTitle] = &dynamodb.AttributeValue{S: aws.String(p.Title)}
		}
		if pubStr != "" {
			item[model.ColPublishedAt] = &dynamodb.AttributeValue{S: &pubStr}
		}
		if p.ModifiedAt != nil {
			item[model.ColModifiedAt] = &dynamodb.AttributeValue{
				S: aws.String(p.ModifiedAt.Format(time.RFC3339)),
			}
		}
		reqs = append(reqs, &dynamodb.WriteRequest{
			PutRequest: &dynamodb.PutRequest{
				Item: item,
			},
		})
	}

	_, err := r.dynamo.BatchWriteItemWithContext(ctx, &dynamodb.BatchWriteItemInput{
		RequestItems: map[string][]*dynamodb.WriteRequest{
			r.dynamoConfig.TableName: reqs,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *PostRepository) primaryKeyValues(id model.PostID) (string, string) {
	pk := fmt.Sprintf("FEED#%s", id.FeedID)
	sk := fmt.Sprintf("POST#%s", id.ItemID)
	return pk, sk
}

func (r *PostRepository) primaryKey(id model.PostID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(id)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}
