package scraper

import (
	"context"
	"net/http"
	"net/url"
	"testing"
	"time"

	"github.com/jarcoal/httpmock"
	"github.com/stretchr/testify/suite"
)

type jsonSuite struct {
	suite.Suite
}

func (suite *jsonSuite) SetupTest() {
	httpmock.Activate()
}

func (suite *jsonSuite) TearDownTest() {
	httpmock.Reset()
}

func (suite *jsonSuite) TestEmptyFeed() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, map[string]interface{}{
			"version": "https://jsonfeed.org/version/1",
			"title":   "My Empty Feed",
			"items":   []interface{}{},
		}))

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)
	suite.Equal(&Feed{
		Title: "My Empty Feed",
	}, f)
}

var feedWithItems = map[string]interface{}{
	"version":       "https://jsonfeed.org/version/1",
	"title":         "Example Blog",
	"feed_url":      "https://example.com/feed.json",
	"home_page_url": "https://example.com",
	"items": []map[string]interface{}{
		{
			"id":             "123",
			"content_text":   "This is some content.",
			"date_published": "2018-07-20T19:14:38+00:00",
			"date_modified":  "2018-07-20T19:14:38+00:00",
		},
		{
			"id":           124,
			"title":        "My Fancy Post Title",
			"content_html": "<p>I have some thoughts <em>about things</em>!</p>",
			"url":          "https://example.com/my-fancy-post-title",
		},
	},
}

func (suite *jsonSuite) TestFeedWithItems() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, feedWithItems))

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)

	t := time.Date(2018, time.July, 20, 19, 14, 38, 0, time.UTC)
	suite.Equal(&Feed{
		Title:       "Example Blog",
		HomePageURL: "https://example.com/",
		Entries: []*Entry{
			&Entry{
				ID:          "123",
				TextContent: "This is some content.",
				PublishedAt: &t,
				ModifiedAt:  &t,
			},
			&Entry{
				ID:          "124",
				Title:       "My Fancy Post Title",
				URL:         "https://example.com/my-fancy-post-title",
				HTMLContent: "<p>I have some thoughts <em>about things</em>!</p>",
			},
		},
	}, f)
}

func (suite *jsonSuite) TestCachingHeaders() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		func(r *http.Request) (*http.Response, error) {
			res, err := httpmock.NewJsonResponse(200, feedWithItems)
			if err != nil {
				return nil, err
			}

			res.Header.Set("Etag", `"asdf"`)
			res.Header.Set("Last-Modified", "2018-07-20T19:14:38")
			return res, nil
		})

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)
	suite.Equal(CachingHeaders{
		Etag:         `"asdf"`,
		LastModified: "2018-07-20T19:14:38",
	}, f.CachingHeaders)
}

func TestJSONSuite(t *testing.T) {
	suite.Run(t, new(jsonSuite))
}
