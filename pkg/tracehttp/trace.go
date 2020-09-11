package tracehttp

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/tracehttp")

var (
	MethodKey     = kv.Key("http.method").String
	URLKey        = kv.Key("http.url").String
	TargetKey     = kv.Key("http.target").String
	HostKey       = kv.Key("http.host").String
	SchemeKey     = kv.Key("http.scheme").String
	StatusCodeKey = kv.Key("http.status_code").Int
	StatusTextKey = kv.Key("http.status_text").String
	FlavorKey     = kv.Key("http.flavor").String
	UserAgentKey  = kv.Key("http.user_agent").String
)
