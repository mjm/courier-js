package feeds

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
)

const (
	colTextContent = "TextContent"
	colHTMLContent = "HTMLContent"
	colPublishedAt = "PublishedAt"
	colModifiedAt  = "ModifiedAt"
)

type PostRepositoryDynamo struct {
	dynamo       dynamodbiface.DynamoDBAPI
	dynamoConfig db.DynamoConfig
}

func NewPostRepositoryDynamo(dynamo dynamodbiface.DynamoDBAPI, dynamoConfig db.DynamoConfig) *PostRepositoryDynamo {
	return &PostRepositoryDynamo{
		dynamo:       dynamo,
		dynamoConfig: dynamoConfig,
	}
}

func (r *PostRepositoryDynamo) FindByItemIDs(ctx context.Context, feedID FeedID, itemIDs []PostID) ([]*PostDynamo, error) {
	var keys dynamodb.KeysAndAttributes
	for _, itemID := range itemIDs {
		keys.Keys = append(keys.Keys, r.primaryKey(feedID, itemID))
	}

	posts := make(map[PostID]*PostDynamo)
	var err2 error
	err := r.dynamo.BatchGetItemPagesWithContext(ctx, &dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			r.dynamoConfig.TableName: &keys,
		},
	}, func(page *dynamodb.BatchGetItemOutput, lastPage bool) bool {
		for _, item := range page.Responses[r.dynamoConfig.TableName] {
			feedID := strings.SplitN(aws.StringValue(item[db.PK].S), "#", 2)[1]
			itemID := strings.SplitN(aws.StringValue(item[db.SK].S), "#", 2)[1]

			t, err := time.Parse(time.RFC3339, aws.StringValue(item[colCreatedAt].S))
			if err != nil {
				err2 = err
				return false
			}

			post := &PostDynamo{
				ID:        PostID(itemID),
				FeedID:    FeedID(feedID),
				URL:       aws.StringValue(item[colURL].S),
				CreatedAt: t,
			}
			if titleVal, ok := item[colTitle]; ok {
				post.Title = aws.StringValue(titleVal.S)
			}
			if textContentVal, ok := item[colTextContent]; ok {
				post.TextContent = aws.StringValue(textContentVal.S)
			}
			if htmlContentVal, ok := item[colHTMLContent]; ok {
				post.HTMLContent = aws.StringValue(htmlContentVal.S)
			}
			if publishedAtVal, ok := item[colPublishedAt]; ok {
				t, err := time.Parse(time.RFC3339, aws.StringValue(publishedAtVal.S))
				if err != nil {
					err2 = err
					return false
				}
				post.PublishedAt = &t
			}
			if modifiedAtVal, ok := item[colModifiedAt]; ok {
				t, err := time.Parse(time.RFC3339, aws.StringValue(modifiedAtVal.S))
				if err != nil {
					err2 = err
					return false
				}
				post.ModifiedAt = &t
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

	var ps []*PostDynamo
	for _, itemID := range itemIDs {
		if p, ok := posts[itemID]; ok {
			ps = append(ps, p)
		}
	}

	return ps, nil
}

type WritePostParams struct {
	FeedID      FeedID
	ItemID      PostID
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
}

func (r *PostRepositoryDynamo) Write(ctx context.Context, ps []WritePostParams) error {
	now := time.Now().Format(time.RFC3339)
	var reqs []*dynamodb.WriteRequest

	for _, p := range ps {
		pk, sk := r.primaryKeyValues(p.FeedID, p.ItemID)
		item := map[string]*dynamodb.AttributeValue{
			db.PK:        {S: &pk},
			db.SK:        {S: &sk},
			colURL:       {S: aws.String(p.URL)},
			colCreatedAt: {S: &now},
			// TODO figure out how to handle updated at if we care
		}
		if p.TextContent != "" {
			item[colTextContent] = &dynamodb.AttributeValue{S: aws.String(p.TextContent)}
		}
		if p.HTMLContent != "" {
			item[colHTMLContent] = &dynamodb.AttributeValue{S: aws.String(p.HTMLContent)}
		}
		if p.Title != "" {
			item[colTitle] = &dynamodb.AttributeValue{S: aws.String(p.Title)}
		}
		if p.PublishedAt != nil {
			item[colPublishedAt] = &dynamodb.AttributeValue{
				S: aws.String(p.PublishedAt.Format(time.RFC3339)),
			}
		}
		if p.ModifiedAt != nil {
			item[colModifiedAt] = &dynamodb.AttributeValue{
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

func (r *PostRepositoryDynamo) primaryKeyValues(feedID FeedID, postID PostID) (string, string) {
	pk := fmt.Sprintf("FEED#%s", feedID)
	sk := fmt.Sprintf("POST#%s", postID)
	return pk, sk
}

func (r *PostRepositoryDynamo) primaryKey(feedID FeedID, postID PostID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(feedID, postID)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}
