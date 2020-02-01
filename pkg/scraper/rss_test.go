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

type rssSuite struct {
	suite.Suite
}

func (suite *rssSuite) SetupTest() {
	httpmock.Activate()
}

func (suite *rssSuite) TearDownTest() {
	httpmock.Reset()
}

func (suite *rssSuite) TestEmptyFeed() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  >
  <channel>
    <title>My Empty Feed</title>
    <description></description>
  </channel>
</rss>
			`)
			res.Header.Set("Content-Type", "application/xml")
			return res, nil
		})

	u, err := url.Parse("https://example.org/feed.xml")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)
	suite.Equal(&Feed{
		Title: "My Empty Feed",
	}, f)
}

var rssFeedWithItems = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  >
  <channel>
    <title>Example Blog</title>
    <atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml" />
    <link>https://example.com</link>
    <description></description>
    <lastBuildDate>Sat, 13 Oct 2018 10:49:30 +0000</lastBuildDate>
    <language>en-US</language>
    <item>
      <title></title>
      <pubDate>Fri, 20 Jul 2018 19:14:38 +0000</pubDate>
      <guid isPermaLink="false">123</guid>
      <description><![CDATA[This is some content.]]></description>
    </item>
    <item>
      <title>My Fancy Post Title</title>
      <link>https://example.com/my-fancy-post-title</link>
      <guid isPermaLink="false">124</guid>
      <content:encoded><![CDATA[<p>I have some thoughts <em>about things</em>!</p>]]></content:encoded>
    </item>
  </channel>
</rss>
`

func (suite *rssSuite) TestFeedWithItems() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, rssFeedWithItems)
			res.Header.Set("Content-Type", "application/xml")
			return res, nil
		})

	u, err := url.Parse("https://example.org/feed.xml")
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

func (suite *rssSuite) TestCachingHeaders() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, rssFeedWithItems)
			res.Header.Set("Content-Type", "application/xml")
			res.Header.Set("Etag", `"asdf"`)
			res.Header.Set("Last-Modified", "2018-07-20T19:14:38")
			return res, nil
		})

	u, err := url.Parse("https://example.org/feed.xml")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)
	suite.Equal(CachingHeaders{
		Etag:         `"asdf"`,
		LastModified: "2018-07-20T19:14:38",
	}, f.CachingHeaders)
}

func TestRSSSuite(t *testing.T) {
	suite.Run(t, new(rssSuite))
}
