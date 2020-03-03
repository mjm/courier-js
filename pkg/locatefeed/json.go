package locatefeed

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

func handleJSON(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	defer res.Body.Close()

	var feedContent struct {
		FeedURL string `json:"feed_url"`
	}
	if err := json.NewDecoder(res.Body).Decode(&feedContent); err != nil {
		return nil, err
	}

	if feedContent.FeedURL == "" {
		return nil, fmt.Errorf("no \"feed_url\" found in JSON feed at %q", u.String())
	}

	newURL, err := url.Parse(feedContent.FeedURL)
	if err != nil {
		return nil, err
	}

	return newURL, nil
}
