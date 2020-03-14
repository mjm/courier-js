package keys

import (
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/key"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

var (
	UserID     = key.New("user_id").String
	AuthDomain = key.New("auth.domain").String

	HTTPMethod = key.New("http.method").String
	HTTPURL    = key.New("http.url").String

	FeedURL = key.New("feed.url").String

	CustomerID     = key.New("billing.customer_id").String
	SubscriptionID = key.New("billing.subscription_id").String
)

func FeedID(id feeds.FeedID) core.KeyValue {
	return key.String("feed.id", id.String())
}

func FeedSubscriptionID(id feeds.SubscriptionID) core.KeyValue {
	return key.String("feed.subscription_id", id.String())
}

func TweetID(id tweets.TweetID) core.KeyValue {
	return key.String("tweet.id", id.String())
}
