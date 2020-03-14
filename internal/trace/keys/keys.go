package keys

import (
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/key"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

var (
	Error       = ErrorKey(key.New("error"))
	ServiceName = key.New("service_name")

	UserID = key.New("user_id").String

	CustomerID     = key.New("billing.customer_id").String
	SubscriptionID = key.New("billing.subscription_id").String
)

func TweetID(id tweets.TweetID) core.KeyValue {
	return key.String("tweet.id", id.String())
}
