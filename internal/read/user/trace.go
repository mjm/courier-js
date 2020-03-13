package user

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/read/user")

var (
	internalTypeKey = key.New("event.type_internal").String
	externalTypeKey = key.New("event.type_external").String
)
