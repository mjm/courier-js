package locatefeed

import (
	"context"
	"fmt"
	"net/http"
	"net/url"

	"github.com/mmcdole/gofeed"
	ext "github.com/mmcdole/gofeed/extensions"
	"github.com/mmcdole/gofeed/rss"
)

func handleFeed(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	defer res.Body.Close()

	fp := gofeed.NewParser()
	fp.RSSTranslator = newRSSTranslator()
	feed, err := fp.Parse(res.Body)
	if err != nil {
		return nil, err
	}

	if feed.FeedLink != "" {
		newURL, err := url.Parse(feed.FeedLink)
		if err == nil {
			return newURL, nil
		}
	}

	return u, nil
}

type rssTranslator struct {
	*gofeed.DefaultRSSTranslator
}

func newRSSTranslator() *rssTranslator {
	return &rssTranslator{
		&gofeed.DefaultRSSTranslator{},
	}
}

func (t *rssTranslator) Translate(feed interface{}) (*gofeed.Feed, error) {
	rss, ok := feed.(*rss.Feed)
	if !ok {
		return nil, fmt.Errorf("feed is not an RSS feed")
	}

	f, err := t.DefaultRSSTranslator.Translate(rss)
	if err != nil {
		return nil, err
	}

	if f.FeedLink == "" {
		f.FeedLink = t.translateFeedFeedLink(rss)
	}

	return f, nil
}

func (t *rssTranslator) translateFeedFeedLink(rss *rss.Feed) (link string) {
	atomExtensions := t.extensionsForKeys([]string{"atom", "atom10", "atom03"}, rss.Extensions)
	for _, ex := range atomExtensions {
		if links, ok := ex["link"]; ok {
			for _, l := range links {
				if l.Attrs["rel"] == "self" {
					link = l.Attrs["href"]
				}
			}
		}
	}
	return
}

func (t *rssTranslator) extensionsForKeys(keys []string, extensions ext.Extensions) (matches []map[string][]ext.Extension) {
	matches = []map[string][]ext.Extension{}

	if extensions == nil {
		return
	}

	for _, key := range keys {
		if match, ok := extensions[key]; ok {
			matches = append(matches, match)
		}
	}
	return
}
