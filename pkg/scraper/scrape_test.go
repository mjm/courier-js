package scraper

import (
	"context"
	"io/ioutil"
	"net/http"
	"net/url"
	"testing"

	"github.com/jarcoal/httpmock"
	"github.com/stretchr/testify/suite"
)

type scrapeSuite struct {
	suite.Suite
}

func (suite *scrapeSuite) SetupTest() {
	httpmock.Activate()
}

func (suite *scrapeSuite) TearDownTest() {
	httpmock.Reset()
}

func (suite *scrapeSuite) TestErrorForUnknownType() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.foo",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, "foo bar")
			res.Header.Set("Content-Type", "application/foo")
			return res, nil
		})

	u, err := url.Parse("https://example.org/feed.foo")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.Error(err)
	suite.Nil(f)
}

func (suite *scrapeSuite) TestNilForCachedResponse() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		func(r *http.Request) (*http.Response, error) {
			suite.Equal(`"asdf"`, r.Header.Get("If-None-Match"))
			suite.Equal("2018-10-20T02:51:43Z", r.Header.Get("If-Modified-Since"))

			return httpmock.NewStringResponse(304, ""), nil
		})

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, &CachingHeaders{
		Etag:         `"asdf"`,
		LastModified: "2018-10-20T02:51:43Z",
	})
	suite.NoError(err)
	suite.Nil(f)
}

func (suite *scrapeSuite) TestServerError() {
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		httpmock.NewStringResponder(500, "Internal Server Error"))

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.Error(err)
	suite.Nil(f)
}

func (suite *scrapeSuite) TestLargeFeed() {
	content, err := ioutil.ReadFile("testdata/overreacted.xml")
	suite.NoError(err)

	httpmock.RegisterResponder("GET", "https://overreacted.io/rss.xml",
		func(r *http.Request) (*http.Response, error) {
			res := httpmock.NewBytesResponse(200, content)
			res.Header.Set("Content-Type", "application/xml")
			return res, nil
		})

	u, err := url.Parse("https://overreacted.io/rss.xml")
	suite.NoError(err)
	f, err := Scrape(context.Background(), u, nil)
	suite.NoError(err)
	suite.Equal(21, len(f.Entries))
}

func TestScrapeSuite(t *testing.T) {
	suite.Run(t, new(scrapeSuite))
}
