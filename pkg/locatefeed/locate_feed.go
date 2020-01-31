package locatefeed

import (
	"context"
	"fmt"
	"mime"
	"net/url"
	"strings"

	"golang.org/x/net/context/ctxhttp"
)

// Locate finds a canonical feed URL from a given website or feed URL.
func Locate(ctx context.Context, url *url.URL) (*url.URL, error) {
	res, err := ctxhttp.Get(ctx, nil, url.String())
	if err != nil {
		return nil, err
	}

	contentType := res.Header.Get("Content-Type")
	if contentType == "" {
		return nil, fmt.Errorf("no content-type header for %q", url)
	}
	contentType, _, err = mime.ParseMediaType(contentType)
	if err != nil {
		return nil, err
	}

	if strings.Contains(contentType, "html") {
		return handleHTML(ctx, url, res)
	}

	if strings.Contains(contentType, "rss") || strings.Contains(contentType, "atom") || strings.Contains(contentType, "xml") {
		return handleFeed(ctx, url, res)
	}

	if strings.Contains(contentType, "json") {
		return handleJSON(ctx, url, res)
	}

	return nil, fmt.Errorf("unexpected content-type %q", contentType)
}
