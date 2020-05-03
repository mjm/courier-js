package shared

import (
	"go.opentelemetry.io/otel/api/global"
)

var tr = global.Tracer("courier.blog/internal/write/shared")
