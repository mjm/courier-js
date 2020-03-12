package tasks

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/tasks")

var (
	nameKey           = key.New("task.name")
	typeKey           = key.New("task.type")
	queueKey          = key.New("task.queue")
	urlKey            = key.New("task.url")
	serviceAccountKey = key.New("task.service_account")
	dataLenKey        = key.New("task.data_length")
)

type taskHeaders map[string]string

func (h taskHeaders) Get(key string) string {
	return h[key]
}

func (h taskHeaders) Set(key string, value string) {
	h[key] = value
}
