package keys

import (
	"go.opentelemetry.io/otel/api/core"
)

type ErrorKey core.Key

func (k ErrorKey) Error(err error) core.KeyValue {
	return core.Key(k).String(err.Error())
}
