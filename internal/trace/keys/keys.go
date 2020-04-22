package keys

import (
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/key"

	"github.com/mjm/courier-js/internal/shared/model"
)

var (
	UserID     = key.New("user_id").String
	AuthDomain = key.New("auth.domain").String

	TaskName = key.New("task.name").String

	FeedURL         = key.New("feed.url").String
	FeedHomePageURL = key.New("feed.home_page_url").String
	TweetURL        = key.New("tweet.url").String
	TweetStatus     = key.New("tweet.status").String

	CustomerID     = key.New("billing.customer_id").String
	SubscriptionID = key.New("billing.subscription_id").String
	Subscribed     = key.New("user.subscribed").Bool
)

func FeedID(id model.FeedID) core.KeyValue {
	return key.String("feed.id", string(id))
}

func PostID(id model.PostID) []core.KeyValue {
	return []core.KeyValue{
		FeedID(id.FeedID),
		key.String("post.id", id.ItemID),
	}
}

func TweetGroupID(id model.TweetGroupID) []core.KeyValue {
	kvs := PostID(id.PostID)
	kvs = append(kvs, UserID(id.UserID))
	return kvs
}
