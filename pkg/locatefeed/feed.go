package locatefeed

import (
	"context"
	"net/http"
	"net/url"

	"github.com/mmcdole/gofeed"
)

func handleFeed(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	defer res.Body.Close()

	fp := gofeed.NewParser()
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
