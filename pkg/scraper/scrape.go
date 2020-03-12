package scraper

import (
	"context"
	"errors"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/purell"
	"go.opentelemetry.io/otel/api/trace"
)

var (
	ErrBadStatus     = errors.New("unexpected response status")
	ErrNoContentType = errors.New("no content type in response")
	ErrInvalid       = errors.New("not a valid feed")
)

func Scrape(ctx context.Context, u *url.URL, cachingHeaders *CachingHeaders) (*Feed, error) {
	ctx, span := tracer.Start(ctx, "scraper.Scrape",
		trace.WithAttributes(urlKey(u.String())))
	defer span.End()

	r, err := http.NewRequestWithContext(ctx, "GET", u.String(), nil)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	if cachingHeaders != nil {
		span.SetAttributes(
			ifNoneMatchKey(cachingHeaders.Etag),
			ifModifiedSinceKey(cachingHeaders.LastModified))
		r.Header.Set("If-None-Match", cachingHeaders.Etag)
		r.Header.Set("If-Modified-Since", cachingHeaders.LastModified)
	}

	res, err := http.DefaultClient.Do(r)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(statusKey(res.StatusCode))

	if res.StatusCode == http.StatusNotModified {
		return nil, nil
	}

	if res.StatusCode > 299 {
		err = fmt.Errorf("%w: %d", ErrBadStatus, res.StatusCode)
		span.RecordError(ctx, err)
		return nil, err
	}

	contentType := res.Header.Get("Content-Type")
	span.SetAttributes(contentTypeKey(contentType))
	if contentType == "" {
		span.RecordError(ctx, err)
		return nil, ErrNoContentType
	}

	contentType, _, err = mime.ParseMediaType(contentType)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	var f *Feed

	if strings.Contains(contentType, "json") {
		f, err = parseJSONFeed(ctx, res)
	}

	if strings.Contains(contentType, "atom") || strings.Contains(contentType, "rss") || strings.Contains(contentType, "xml") {
		f, err = parseXMLFeed(ctx, res)
	}

	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	if f != nil {
		f.CachingHeaders.Etag = res.Header.Get("Etag")
		f.CachingHeaders.LastModified = res.Header.Get("Last-Modified")
		span.SetAttributes(etagKey(f.CachingHeaders.Etag), lastModifiedKey(f.CachingHeaders.LastModified))
		return f, nil
	}

	span.RecordError(ctx, ErrInvalid)
	return nil, ErrInvalid
}

func NormalizeURL(url string) string {
	normalized, err := purell.NormalizeURLString(url, purell.FlagsSafe|purell.FlagAddTrailingSlash|purell.FlagRemoveDotSegments)
	if err != nil {
		return url
	}

	return normalized
}
