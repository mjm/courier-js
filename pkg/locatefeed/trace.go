package locatefeed

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/locatefeed")

var (
	urlKey               = kv.Key("url").String
	canonicalURLKey      = kv.Key("url_canonical").String
	statusKey            = kv.Key("response.status").Int
	contentTypeKey       = kv.Key("content_type").String
	parsedContentTypeKey = kv.Key("content_type_parsed").String
)
