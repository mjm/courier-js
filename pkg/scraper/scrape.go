package scraper

import (
	"context"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"strings"
)

func Scrape(ctx context.Context, u *url.URL, cachingHeaders *CachingHeaders) (*Feed, error) {
	r, err := http.NewRequestWithContext(ctx, "GET", u.String(), nil)
	if err != nil {
		return nil, err
	}

	if cachingHeaders != nil {
		r.Header.Set("If-None-Match", cachingHeaders.Etag)
		r.Header.Set("If-Modified-Since", cachingHeaders.LastModified)
	}

	res, err := http.DefaultClient.Do(r)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == http.StatusNotModified {
		return nil, nil
	}

	if res.StatusCode > 299 {
		return nil, fmt.Errorf("unexpected response code %d", res.StatusCode)
	}

	contentType := res.Header.Get("Content-Type")
	if contentType == "" {
		return nil, fmt.Errorf("no content type in response")
	}

	contentType, _, err = mime.ParseMediaType(contentType)
	if err != nil {
		return nil, err
	}

	if strings.Contains(contentType, "json") {
		return parseJSONFeed(ctx, res)
	}

	if strings.Contains(contentType, "atom") || strings.Contains(contentType, "rss") || strings.Contains(contentType, "xml") {
		return parseXMLFeed(ctx, res)
	}

	return nil, fmt.Errorf("not a valid feed")
}
