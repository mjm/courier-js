package tweets

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write/tweets")

var (
	postedTweetIDKey  = key.New("tweet.posted_id").Int64
	responseStatusKey = key.New("twitter.response.status").Int
)
