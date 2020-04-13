package shared

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds"
)

const (
	colTextContent = "TextContent"
	colHTMLContent = "HTMLContent"
	colPublishedAt = "PublishedAt"
	colModifiedAt  = "ModifiedAt"
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

func (r *PostRepository) FindByItemIDs(ctx context.Context, feedID feeds.FeedID, itemIDs []feeds.PostID) ([]*Post, error) {
	var keys dynamodb.KeysAndAttributes
	for _, itemID := range itemIDs {
		keys.Keys = append(keys.Keys, r.primaryKey(feedID, itemID))
	}

	posts := make(map[feeds.PostID]*Post)
	var err2 error
	err := r.dynamo.BatchGetItemPagesWithContext(ctx, &dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			r.dynamoConfig.TableName: &keys,
		},
	}, func(page *dynamodb.BatchGetItemOutput, lastPage bool) bool {
		for _, item := range page.Responses[r.dynamoConfig.TableName] {
			post, err := newPostFromAttrs(item)
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

	var ps []*Post
	for _, itemID := range itemIDs {
		if p, ok := posts[itemID]; ok {
			ps = append(ps, p)
		}
	}

	return ps, nil
}

type WritePostParams struct {
	FeedID      feeds.FeedID
	ItemID      feeds.PostID
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
		pk, sk := r.primaryKeyValues(p.FeedID, p.ItemID)

		var pubStr string
		if p.PublishedAt != nil {
			pubStr = p.PublishedAt.Format(time.RFC3339)
		}
		publishedKey := fmt.Sprintf("#POST#%s", pubStr)

		item := map[string]*dynamodb.AttributeValue{
			db.PK:        {S: &pk},
			db.SK:        {S: &sk},
			db.GSI1PK:    {S: &pk},
			db.GSI1SK:    {S: &publishedKey},
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
		if pubStr != "" {
			item[colPublishedAt] = &dynamodb.AttributeValue{S: &pubStr}
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

func (r *PostRepository) primaryKeyValues(feedID feeds.FeedID, postID feeds.PostID) (string, string) {
	pk := fmt.Sprintf("FEED#%s", feedID)
	sk := fmt.Sprintf("POST#%s", postID)
	return pk, sk
}

func (r *PostRepository) primaryKey(feedID feeds.FeedID, postID feeds.PostID) map[string]*dynamodb.AttributeValue {
	pk, sk := r.primaryKeyValues(feedID, postID)
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

func newPostFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Post, error) {
	feedID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	itemID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	t, err := time.Parse(time.RFC3339, aws.StringValue(attrs[colCreatedAt].S))
	if err != nil {
		return nil, err
	}

	post := &Post{
		ID:        feeds.PostID(itemID),
		FeedID:    feeds.FeedID(feedID),
		URL:       aws.StringValue(attrs[colURL].S),
		CreatedAt: t,
	}
	if titleVal, ok := attrs[colTitle]; ok {
		post.Title = aws.StringValue(titleVal.S)
	}
	if textContentVal, ok := attrs[colTextContent]; ok {
		post.TextContent = aws.StringValue(textContentVal.S)
	}
	if htmlContentVal, ok := attrs[colHTMLContent]; ok {
		post.HTMLContent = aws.StringValue(htmlContentVal.S)
	}
	if publishedAtVal, ok := attrs[colPublishedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(publishedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.PublishedAt = &t
	}
	if modifiedAtVal, ok := attrs[colModifiedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(modifiedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.ModifiedAt = &t
	}

	return post, nil
}
