package event

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/event")

var (
	typeKey        = kv.Key("event.type").String
	isProtoKey     = kv.Key("event.is_proto").Bool
	dataLenKey     = kv.Key("event.data_length").Int
	publishedIDKey = kv.Key("event.published_id").String
)
