package micropub

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/micropub")

var (
	endpointKey = kv.Key("micropub.endpoint").String
)
