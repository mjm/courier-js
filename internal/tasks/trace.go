package tasks

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/tasks")

var (
	nameKey           = kv.Key("task.name")
	typeKey           = kv.Key("task.type")
	queueKey          = kv.Key("task.queue")
	urlKey            = kv.Key("task.url")
	serviceAccountKey = kv.Key("task.service_account")
	dataLenKey        = kv.Key("task.data_length")
)

type taskHeaders map[string]string

func (h taskHeaders) Get(key string) string {
	return h[key]
}

func (h taskHeaders) Set(key string, value string) {
	h[key] = value
}
