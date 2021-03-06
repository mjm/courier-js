package model

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
)

const (
	TypePost = "Post"

	ColTextContent = "TextContent"
	ColHTMLContent = "HTMLContent"
	ColPublishedAt = "PublishedAt"
	ColModifiedAt  = "ModifiedAt"
)

type PostID struct {
	FeedID FeedID `json:"feedId"`
	ItemID string `json:"itemId"`
}

func PostIDFromParts(feedID FeedID, itemID string) PostID {
	return PostID{
		FeedID: feedID,
		ItemID: itemID,
	}
}

func (id PostID) PrimaryKeyValues() (string, string) {
	pk := "FEED#" + string(id.FeedID)
	sk := "POST#" + id.ItemID
	return pk, sk
}

func (id PostID) PrimaryKey() map[string]*dynamodb.AttributeValue {
	pk, sk := id.PrimaryKeyValues()
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

func (id PostID) String() string {
	return string(id.FeedID) + "###" + id.ItemID
}

type Post struct {
	ID          PostID
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
	if err := typeAssert(TypePost, attrs); err != nil {
		return nil, err
	}

	feedID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	itemID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	t, err := ParseTime(aws.StringValue(attrs[ColCreatedAt].S))
	if err != nil {
		return nil, err
	}

	post := &Post{
		ID: PostID{
			FeedID: FeedID(feedID),
			ItemID: itemID,
		},
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
		t, err := ParseTime(aws.StringValue(publishedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.PublishedAt = &t
	}
	if modifiedAtVal, ok := attrs[ColModifiedAt]; ok {
		t, err := ParseTime(aws.StringValue(modifiedAtVal.S))
		if err != nil {
			return nil, err
		}
		post.ModifiedAt = &t
	}

	return post, nil
}

func (p Post) FeedID() FeedID {
	return p.ID.FeedID
}

func (p Post) ItemID() string {
	return p.ID.ItemID
}
