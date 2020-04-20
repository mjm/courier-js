package model

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/segmentio/ksuid"

	"github.com/mjm/courier-js/internal/db"
)

const (
	TypeFeed = "Feed"

	ColURL              = "URL"
	ColTitle            = "Title"
	ColHomePageURL      = "HomePageURL"
	ColRefreshedAt      = "RefreshedAt"
	ColCreatedAt        = "CreatedAt"
	ColUpdatedAt        = "UpdatedAt"
	ColMicropubEndpoint = "MicropubEndpoint"
	ColCachingHeaders   = "CachingHeaders"
	ColEtag             = "Etag"
	ColLastModified     = "LastModified"
	ColAutopost         = "Autopost"
)

type FeedID string

func NewFeedID() FeedID {
	return FeedID(ksuid.New().String())
}

type UserFeedID struct {
	UserID string
	FeedID FeedID
}

func (id UserFeedID) PrimaryKeyValues() (string, string) {
	pk := "USER#" + id.UserID
	sk := "FEED#" + string(id.FeedID)
	return pk, sk
}

func (id UserFeedID) PrimaryKey() map[string]*dynamodb.AttributeValue {
	pk, sk := id.PrimaryKeyValues()
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

func (id UserFeedID) String() string {
	return id.UserID + "###" + string(id.FeedID)
}

type Feed struct {
	ID               FeedID
	UserID           string
	URL              string
	Title            string
	HomePageURL      string
	RefreshedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	CachingHeaders   *CachingHeaders
	MicropubEndpoint string
	Autopost         bool
}

func NewFeedFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Feed, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	feedID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	feed := &Feed{
		ID:       FeedID(feedID),
		UserID:   userID,
		URL:      aws.StringValue(attrs[ColURL].S),
		Autopost: aws.BoolValue(attrs[ColAutopost].BOOL),
	}

	if titleVal, ok := attrs[ColTitle]; ok {
		feed.Title = aws.StringValue(titleVal.S)
	}

	if homePageURLVal, ok := attrs[ColHomePageURL]; ok {
		feed.HomePageURL = aws.StringValue(homePageURLVal.S)
	}

	if refreshedAtVal, ok := attrs[ColRefreshedAt]; ok {
		t, err := ParseTime(aws.StringValue(refreshedAtVal.S))
		if err != nil {
			return nil, err
		}
		feed.RefreshedAt = &t
	}

	var err error

	feed.CreatedAt, err = ParseTime(aws.StringValue(attrs[ColCreatedAt].S))
	if err != nil {
		return nil, err
	}

	feed.UpdatedAt, err = ParseTime(aws.StringValue(attrs[ColUpdatedAt].S))
	if err != nil {
		return nil, err
	}

	if micropubEndpointVal, ok := attrs[ColMicropubEndpoint]; ok {
		feed.MicropubEndpoint = aws.StringValue(micropubEndpointVal.S)
	}

	if cachingHeadersVal, ok := attrs[ColCachingHeaders]; ok {
		feed.CachingHeaders = &CachingHeaders{}
		if val, ok := cachingHeadersVal.M[ColEtag]; ok {
			feed.CachingHeaders.Etag = aws.StringValue(val.S)
		}
		if val, ok := cachingHeadersVal.M[ColLastModified]; ok {
			feed.CachingHeaders.LastModified = aws.StringValue(val.S)
		}
	}

	return feed, nil
}

type CachingHeaders struct {
	Etag         string `json:"etag,omitempty"`
	LastModified string `json:"lastModified,omitempty"`
}
