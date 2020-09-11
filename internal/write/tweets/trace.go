package tweets

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write/tweets")

var (
	postedTweetIDKey  = kv.Key("tweet.posted_id").Int64
	responseStatusKey = kv.Key("twitter.response.status").Int
)
