package locatefeed

import (
	"context"
	"errors"
	"fmt"
	"mime"
	"net/url"
	"strings"

	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/net/context/ctxhttp"
)

var (
	ErrNoContentType  = errors.New("no content-type header")
	ErrBadContentType = errors.New("unexpected content-type")
)

// Locate finds a canonical feed URL from a given website or feed URL.
func Locate(ctx context.Context, url *url.URL) (*url.URL, error) {
	ctx, span := tracer.Start(ctx, "locatefeed.Locate",
		trace.WithAttributes(urlKey(url.String())))
	defer span.End()

	res, err := ctxhttp.Get(ctx, nil, url.String())
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	contentType := res.Header.Get("Content-Type")
	span.SetAttributes(
		statusKey(res.StatusCode),
		contentTypeKey(contentType))

	if contentType == "" {
		span.RecordError(ctx, ErrNoContentType)
		return nil, fmt.Errorf("%w for %q", ErrNoContentType, url)
	}
	contentType, _, err = mime.ParseMediaType(contentType)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}
	span.SetAttributes(parsedContentTypeKey(contentType))

	if strings.Contains(contentType, "html") {
		return handleHTML(ctx, url, res)
	}

	if strings.Contains(contentType, "rss") || strings.Contains(contentType, "atom") || strings.Contains(contentType, "xml") {
		return handleFeed(ctx, url, res)
	}

	if strings.Contains(contentType, "json") {
		return handleJSON(ctx, url, res)
	}

	span.RecordError(ctx, ErrBadContentType)
	return nil, fmt.Errorf("%w: %q", ErrBadContentType, contentType)
}
