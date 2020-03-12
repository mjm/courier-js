package scraper

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/scraper")

var (
	urlKey             = key.New("scrape.url").String
	ifNoneMatchKey     = key.New("scrape.if_none_match").String
	ifModifiedSinceKey = key.New("scrape.if_modified_since").String
	etagKey            = key.New("scrape.etag").String
	lastModifiedKey    = key.New("scrape.last_modified").String
	statusKey          = key.New("response.status.code").Int
	contentTypeKey     = key.New("response.content_type").String
)

var (
	feedTitleKey     = key.New("feed.title").String
	feedHomeURL      = key.New("feed.home_page_url").String
	feedItemCountKey = key.New("feed.item_count").Int
)
