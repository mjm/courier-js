package locatefeed

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"testing"

	"github.com/jarcoal/httpmock"
	"github.com/stretchr/testify/suite"
)

type locateSuite struct {
	suite.Suite
}

func (suite *locateSuite) SetupTest() {
	httpmock.Activate()
}

func (suite *locateSuite) TearDownTest() {
	httpmock.DeactivateAndReset()
}

func (suite *locateSuite) TestJSONFeedByExactURL() {
	resp := map[string]interface{}{
		"feed_url": "https://www.example.org/feed.json",
	}
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, resp))

	u, err := url.Parse("https://www.example.org/feed.json")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.json", u.String())
}

func (suite *locateSuite) TestJSONFeedErrorIfNoURL() {
	resp := map[string]interface{}{}
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, resp))

	u, err := url.Parse("https://www.example.org/feed.json")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.Nil(u)
	suite.Error(err)
}

func (suite *locateSuite) TestJSONFeedUsesURLFromFeed() {
	resp := map[string]interface{}{
		"feed_url": "https://www.example.org/feeds/json",
	}
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, resp))

	u, err := url.Parse("https://www.example.org/feed.json")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feeds/json", u.String())
}

func (suite *locateSuite) TestFollowsRedirects() {
	resp := map[string]interface{}{
		"feed_url": "https://www.example.org/feeds/json",
	}
	httpmock.RegisterResponder("GET", "https://example.org/feed.json",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(301, "Redirecting...")
			res.Header.Set("Location", "https://www.example.org/feed.json")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, resp))

	u, err := url.Parse("https://example.org/feed.json")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feeds/json", u.String())
}

func (suite *locateSuite) TestRSSFeedWithNoSelfLink() {
	resp := `
	<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <atom:link href="https://example.org/" />
    </channel>
  </rss>
	`
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.xml",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "application/rss+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/feed.xml")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.xml", u.String())
}

func (suite *locateSuite) TestRSSFeedWithSelfLink() {
	resp := `
	<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
			<atom:link href="https://example.org/" />
      <atom:link href="https://www.example.org/feeds/rss" rel="self" type="application/rss+xml" />
    </channel>
  </rss>
	`
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.xml",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "application/rss+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/feed.xml")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feeds/rss", u.String())
}

func (suite *locateSuite) TestAtomFeedWithNoSelfLink() {
	resp := `
  <?xml version="1.0" encoding="UTF-8"?>
  <feed
    xmlns="http://www.w3.org/2005/Atom"
    xml:lang="en-US">
    <link rel="alternate" type="text/html" href="https://example.org/" />
    <id>https://example.com/feed.atom</id>
    <author>
      <name>John</name>
      <uri>https://john.example.com</uri>
    </author>
  </feed>
	`
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.atom",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "application/atom+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/feed.atom")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.atom", u.String())
}

func (suite *locateSuite) TestAtomFeedWithSelfLink() {
	resp := `
	<?xml version="1.0" encoding="UTF-8"?>
  <feed
    xmlns="http://www.w3.org/2005/Atom"
    xml:lang="en-US">
    <link rel="alternate" type="text/html" href="https://example.org/" />
    <link rel="self" type="application/atom+xml" href="https://www.example.org/feeds/atom" />
    <id>https://example.com/feed.atom</id>
    <author>
      <name>John</name>
      <uri>https://john.example.com</uri>
    </author>
  </feed>
	`
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.atom",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "application/atom+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/feed.atom")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feeds/atom", u.String())
}

func (suite *locateSuite) TestGenericXMLContentType() {
	resp := `
	<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
			<atom:link href="https://example.org/" />
      <atom:link href="https://www.example.org/feeds/rss" rel="self" type="application/rss+xml" />
    </channel>
  </rss>
	`
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.xml",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "application/xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/feed.xml")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feeds/rss", u.String())
}

func (suite *locateSuite) TestFindJSONFeedFromHTMLPage() {
	resp := htmlWithLinks(feedLink{Type: "application/json", Href: "https://www.example.org/feed.json"})

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, map[string]interface{}{
			"feed_url": "https://www.example.org/feed.json",
		}))

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.json", u.String())
}

func (suite *locateSuite) TestFindJSONFeedFromHTMLPageRelativePath() {
	resp := htmlWithLinks(feedLink{Type: "application/json", Href: "/feed.json"})

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, map[string]interface{}{
			"feed_url": "https://www.example.org/feed.json",
		}))

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.json", u.String())
}

func (suite *locateSuite) TestFindAtomFeedFromHTMLPage() {
	resp := htmlWithLinks(feedLink{Type: "application/atom+xml", Href: "/feed.atom"})

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.atom",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `<feed></feed>`)
			res.Header.Set("Content-Type", "application/atom+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.atom", u.String())
}

func (suite *locateSuite) TestFindRSSFeedFromHTMLPage() {
	resp := htmlWithLinks(feedLink{Type: "application/rss+xml", Href: "/feed.xml"})

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.xml",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `<rss></rss>`)
			res.Header.Set("Content-Type", "application/rss+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.xml", u.String())
}

func (suite *locateSuite) TestPrioritizesJSONFeedFirst() {
	resp := htmlWithLinks(
		feedLink{Type: "application/rss+xml", Href: "/feed.xml"},
		feedLink{Type: "application/json", Href: "/feed.json"},
		feedLink{Type: "application/atom+xml", Href: "/feed.atom"},
	)

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.json",
		httpmock.NewJsonResponderOrPanic(200, map[string]interface{}{
			"feed_url": "https://www.example.org/feed.json",
		}))

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.json", u.String())
}

func (suite *locateSuite) TestPrioritizesAtomFeedSecond() {
	resp := htmlWithLinks(
		feedLink{Type: "application/rss+xml", Href: "/feed.xml"},
		feedLink{Type: "application/atom+xml", Href: "/feed.atom"},
	)

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.atom",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `<feed></feed>`)
			res.Header.Set("Content-Type", "application/atom+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.atom", u.String())
}

func (suite *locateSuite) TestIgnoresUnknownLinkTypes() {
	resp := htmlWithLinks(
		feedLink{Type: "application/blarg", Href: "/feed.blarg"},
		feedLink{Type: "application/atom+xml", Href: "/feed.atom"},
	)

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})
	httpmock.RegisterResponder("GET", "https://www.example.org/feed.atom",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, `<feed></feed>`)
			res.Header.Set("Content-Type", "application/atom+xml")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.NoError(err)
	suite.Equal("https://www.example.org/feed.atom", u.String())
}

func (suite *locateSuite) TestErrorsWithNoValidFeedLinks() {
	resp := htmlWithLinks(feedLink{Type: "application/blarg", Href: "/feed.blarg"})

	httpmock.RegisterResponder("GET", "https://www.example.org/",
		func(*http.Request) (*http.Response, error) {
			res := httpmock.NewStringResponse(200, resp)
			res.Header.Set("Content-Type", "text/html")
			return res, nil
		})

	u, err := url.Parse("https://www.example.org/")
	suite.NoError(err)
	u, err = Locate(context.Background(), u)
	suite.Error(err)
}

func TestLocateSuite(t *testing.T) {
	suite.Run(t, new(locateSuite))
}

type feedLink struct {
	Type string
	Href string
}

func htmlWithLinks(links ...feedLink) string {
	var b strings.Builder
	b.WriteString(`
	<!DOCTYPE html>
	<html><head>`)
	for _, link := range links {
		fmt.Fprintf(&b, `<link rel="alternate" type="%s" href="%s">`, link.Type, link.Href)
	}
	b.WriteString(`
	</head>
	<body>Hello!</body>
	</html>`)
	return b.String()
}
