package keys

import (
	"go.opentelemetry.io/otel/api/key"
)

var (
	Error = ErrorKey(key.New("error"))
)
