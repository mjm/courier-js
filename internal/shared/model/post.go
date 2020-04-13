package model

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds"
)

const (
	ColTextContent = "TextContent"
	ColHTMLContent = "HTMLContent"
	ColPublishedAt = "PublishedAt"
	ColModifiedAt  = "ModifiedAt"
)

type Post struct {
	ID          feeds.PostID
	FeedID      feeds.FeedID
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func NewPostFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Post, error) {
	feedID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	itemID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	t, err := time.Parse(time.RFC3339, aws.StringValue(attrs[ColCreatedAt].S))
	if err != nil {
		return nil, err
	}

	post := &Post{
		ID:        feeds.PostID(itemID),
		FeedID:    feeds.FeedID(feedID),
		URL:       aws.StringValue(attrs[ColURL].S),
		CreatedAt: t,
	}
	if titleVal, ok := attrs[ColTitle]; ok {
		post.Title = aws.StringValue(titleVal.S)
	}
	if textContentVal, ok := attrs[ColTextContent]; ok {
		post.TextContent = aws.StringValue(textContentVal.S)
	}
	if htmlContentVal, ok := attrs[ColHTMLContent]; ok {
		post.HTMLContent = aws.StringValue(htmlContentVal.S)
	}
	if publishedAtVal, ok := attrs[ColPublishedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(publishedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.PublishedAt = &t
	}
	if modifiedAtVal, ok := attrs[ColModifiedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(modifiedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.ModifiedAt = &t
	}

	return post, nil
}
