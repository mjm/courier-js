package locatefeed

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"go.opentelemetry.io/otel/api/trace"
)

var (
	ErrJSONNoFeedURL = errors.New("no \"feed_url\" found in JSON feed")
)

func handleJSON(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	ctx, span := tracer.Start(ctx, "locatefeed.handleJSON",
		trace.WithAttributes(urlKey(u.String())))
	defer span.End()

	defer res.Body.Close()

	var feedContent struct {
		FeedURL string `json:"feed_url"`
	}
	if err := json.NewDecoder(res.Body).Decode(&feedContent); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(canonicalURLKey(feedContent.FeedURL))

	if feedContent.FeedURL == "" {
		span.RecordError(ctx, ErrJSONNoFeedURL)
		return nil, fmt.Errorf("%w at %q", ErrJSONNoFeedURL, u.String())
	}

	newURL, err := url.Parse(feedContent.FeedURL)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return newURL, nil
}
