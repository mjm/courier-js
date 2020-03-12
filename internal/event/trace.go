package event

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/event")

var (
	typeKey        = key.New("event.type").String
	isProtoKey     = key.New("event.is_proto").Bool
	dataLenKey     = key.New("event.data_length").Int
	publishedIDKey = key.New("event.published_id").String
)
