package scraper

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/scraper")

var (
	urlKey             = kv.Key("scrape.url").String
	ifNoneMatchKey     = kv.Key("scrape.if_none_match").String
	ifModifiedSinceKey = kv.Key("scrape.if_modified_since").String
	etagKey            = kv.Key("scrape.etag").String
	lastModifiedKey    = kv.Key("scrape.last_modified").String
	statusKey          = kv.Key("response.status.code").Int
	contentTypeKey     = kv.Key("response.content_type").String
)

var (
	feedTitleKey     = kv.Key("feed.title").String
	feedHomeURL      = kv.Key("feed.home_page_url").String
	feedItemCountKey = kv.Key("feed.item_count").Int
)
