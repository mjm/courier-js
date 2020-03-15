package micropub

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/micropub")

var (
	endpointKey = key.New("micropub.endpoint").String
)
