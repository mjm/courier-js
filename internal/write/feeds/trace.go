package feeds

import (
	"go.opentelemetry.io/otel/api/global"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write/feeds")
