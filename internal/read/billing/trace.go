package billing

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/read/billing")

var (
	customerIDKey     = kv.Key("stripe.customer_id").String
	subscriptionIDKey = kv.Key("stripe.subscription_id").String
)
