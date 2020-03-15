package tracehttp

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/tracehttp")

var (
	MethodKey     = key.New("http.method").String
	URLKey        = key.New("http.url").String
	TargetKey     = key.New("http.target").String
	HostKey       = key.New("http.host").String
	SchemeKey     = key.New("http.scheme").String
	StatusCodeKey = key.New("http.status_code").Int
	StatusTextKey = key.New("http.status_text").String
	FlavorKey     = key.New("http.flavor").String
	UserAgentKey  = key.New("http.user_agent").String
)
