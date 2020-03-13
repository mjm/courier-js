package locatefeed

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/locatefeed")

var (
	urlKey               = key.New("url").String
	canonicalURLKey      = key.New("url_canonical").String
	statusKey            = key.New("response.status").Int
	contentTypeKey       = key.New("content_type").String
	parsedContentTypeKey = key.New("content_type_parsed").String
)
