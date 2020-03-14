package billing

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/read/billing")

var (
	customerIDKey     = key.New("stripe.customer_id").String
	subscriptionIDKey = key.New("stripe.subscription_id").String
)
