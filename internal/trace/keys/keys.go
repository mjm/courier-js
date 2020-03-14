package keys

import (
	"go.opentelemetry.io/otel/api/key"
)

var (
	Error       = ErrorKey(key.New("error"))
	ServiceName = key.New("service_name")

	UserID = key.New("user_id").String

	CustomerID     = key.New("billing.customer_id").String
	SubscriptionID = key.New("billing.subscription_id").String
)
