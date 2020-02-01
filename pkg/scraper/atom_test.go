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

type atomSuite struct {
	suite.Suite
}

func (suite *atomSuite) SetupTest() {
	httpmock.Activate()
}

func (suite *atomSuite) TearDownTest() {
	httpmock.Reset()
}

func (suite *atomSuite) TestEmptyFeed() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `
<?xml version="1.0" encoding="UTF-8"?>
<feed
	xmlns="http://www.w3.org/2005/Atom"
	xml:lang="en-US"
	xml:base="https://mattmoriarity.com/wp-atom.php">
	<title type="text">My Empty Feed</title>
	<updated>2018-10-20T02:51:43Z</updated>
	<author>
		<name>John</name>
		<uri>https://john.example.com</uri>
	</author>
</feed>
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

var atomFeedWithItems = `
<?xml version="1.0" encoding="UTF-8"?>
<feed
  xmlns="http://www.w3.org/2005/Atom"
  xml:lang="en-US"
  xml:base="https://mattmoriarity.com/wp-atom.php">
  <title type="text">Example Blog</title>
  <updated>2018-10-20T02:51:43Z</updated>
  <link rel="alternate" type="text/html" href="https://example.com" />
  <id>https://example.com/feed.atom</id>
  <entry>
    <title type="html"><![CDATA[]]></title>
    <published>2018-07-20T19:14:38Z</published>
    <updated>2018-07-20T19:14:38Z</updated>
    <id>https://example.com/123</id>
    <summary><![CDATA[This is some content.]]></summary>
    <author>
      <name>John</name>
      <uri>https://john.example.com</uri>
    </author>
  </entry>
  <entry>
    <title type="text">My Fancy Post Title</title>
    <updated>2018-07-20T19:14:38Z</updated>
    <link rel="alternate" type="text/html" href="https://example.com/my-fancy-post-title" />
    <id>https://example.com/124</id>
    <content type="html"><![CDATA[<p>I have some thoughts <em>about things</em>!</p>]]></content>
    <author>
      <name>John</name>
      <uri>https://john.example.com</uri>
    </author>
  </entry>
</feed>
`

func (suite *atomSuite) TestFeedWithItems() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, atomFeedWithItems)
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
				ID:          "https://example.com/123",
				TextContent: "This is some content.",
				PublishedAt: &t,
				ModifiedAt:  &t,
			},
			&Entry{
				ID:          "https://example.com/124",
				Title:       "My Fancy Post Title",
				URL:         "https://example.com/my-fancy-post-title",
				HTMLContent: "<p>I have some thoughts <em>about things</em>!</p>",
				ModifiedAt:  &t,
			},
		},
	}, f)
}

func (suite *atomSuite) TestCachingHeaders() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, atomFeedWithItems)
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

func TestAtomSuite(t *testing.T) {
	suite.Run(t, new(atomSuite))
}
