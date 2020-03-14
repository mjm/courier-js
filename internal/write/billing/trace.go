package billing

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write/billing")

var (
	customerIDKey     = key.New("stripe.customer_id").String
	subscriptionIDKey = key.New("stripe.subscription_id").String
	planIDKey         = key.New("stripe.plan_id").String
	tokenIDKey        = key.New("stripe.token_id").String
)
