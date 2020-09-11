package billing

import (
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write/billing")

var (
	customerIDKey      = kv.Key("stripe.customer_id").String
	subscriptionIDKey  = kv.Key("stripe.subscription_id").String
	planIDKey          = kv.Key("stripe.plan_id").String
	tokenIDKey         = kv.Key("stripe.token_id").String
	paymentMethodIDKey = kv.Key("stripe.payment_method_id").String
)
