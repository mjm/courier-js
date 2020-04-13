package shared

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds"
)

type Feed struct {
	ID               feeds.FeedID
	UserID           string
	URL              string
	Title            string
	HomePageURL      string
	RefreshedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	CachingHeaders   *feeds.CachingHeaders
	MicropubEndpoint string
	Autopost         bool
}

func newFeedFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Feed, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	feedID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	feed := &Feed{
		ID:       feeds.FeedID(feedID),
		UserID:   userID,
		URL:      aws.StringValue(attrs[colURL].S),
		Autopost: aws.BoolValue(attrs[colAutopost].BOOL),
	}

	if titleVal, ok := attrs[colTitle]; ok {
		feed.Title = aws.StringValue(titleVal.S)
	}

	if homePageURLVal, ok := attrs[colHomePageURL]; ok {
		feed.HomePageURL = aws.StringValue(homePageURLVal.S)
	}

	if refreshedAtVal, ok := attrs[colRefreshedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(refreshedAtVal.S))
		if err != nil {
			return nil, err
		}
		feed.RefreshedAt = &t
	}

	var err error

	feed.CreatedAt, err = time.Parse(time.RFC3339, aws.StringValue(attrs[colCreatedAt].S))
	if err != nil {
		return nil, err
	}

	feed.UpdatedAt, err = time.Parse(time.RFC3339, aws.StringValue(attrs[colUpdatedAt].S))
	if err != nil {
		return nil, err
	}

	if micropubEndpointVal, ok := attrs[colMicropubEndpoint]; ok {
		feed.MicropubEndpoint = aws.StringValue(micropubEndpointVal.S)
	}

	if cachingHeadersVal, ok := attrs[colCachingHeaders]; ok {
		feed.CachingHeaders = &feeds.CachingHeaders{
			Etag:         aws.StringValue(cachingHeadersVal.M[colEtag].S),
			LastModified: aws.StringValue(cachingHeadersVal.M[colLastModified].S),
		}
	}

	return feed, nil
}
