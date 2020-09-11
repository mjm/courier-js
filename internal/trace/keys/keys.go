package keys

import (
	"go.opentelemetry.io/otel/api/kv"

	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	UserID     = kv.Key("user_id").String
	AuthDomain = kv.Key("auth.domain").String

	TaskName = kv.Key("task.name").String

	FeedURL         = kv.Key("feed.url").String
	FeedHomePageURL = kv.Key("feed.home_page_url").String
	TweetURL        = kv.Key("tweet.url").String
	TweetStatus     = kv.Key("tweet.status").String

	CustomerID     = kv.Key("billing.customer_id").String
	SubscriptionID = kv.Key("billing.subscription_id").String
	Subscribed     = kv.Key("user.subscribed").Bool
)

func FeedID(id model.FeedID) kv.KeyValue {
	return kv.String("feed.id", string(id))
}

func PostID(id model.PostID) []kv.KeyValue {
	return []kv.KeyValue{
		FeedID(id.FeedID),
		kv.String("post.id", id.ItemID),
	}
}

func TweetGroupID(id model.TweetGroupID) []kv.KeyValue {
	kvs := PostID(id.PostID)
	kvs = append(kvs, UserID(id.UserID))
	return kvs
}
