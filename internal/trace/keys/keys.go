package keys

import (
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/key"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

var (
	UserID     = key.New("user_id").String
	AuthDomain = key.New("auth.domain").String

	TaskName = key.New("task.name").String

	HTTPMethod = key.New("http.method").String
	HTTPURL    = key.New("http.url").String

	FeedURL         = key.New("feed.url").String
	FeedHomePageURL = key.New("feed.home_page_url").String
	TweetURL        = key.New("tweet.url").String
	TweetStatus     = key.New("tweet.status").String

	CustomerID     = key.New("billing.customer_id").String
	SubscriptionID = key.New("billing.subscription_id").String
	Subscribed     = key.New("user.subscribed").Bool
)

func FeedID(id feeds.FeedID) core.KeyValue {
	return key.String("feed.id", id.String())
}

func FeedIDDynamo(id model.FeedID) core.KeyValue {
	return key.String("feed.id", string(id))
}

func PostID(id feeds.PostID) core.KeyValue {
	return key.String("post.id", id.String())
}

func PostIDDynamo(id model.PostID) []core.KeyValue {
	return []core.KeyValue{
		FeedIDDynamo(id.FeedID),
		key.String("post.id", id.ItemID),
	}
}

func FeedSubscriptionID(id feeds.SubscriptionID) core.KeyValue {
	return key.String("feed.subscription_id", id.String())
}

func TweetID(id tweets.TweetID) core.KeyValue {
	return key.String("tweet.id", id.String())
}

func TweetGroupID(id model.TweetGroupID) []core.KeyValue {
	kvs := PostIDDynamo(id.PostID)
	kvs = append(kvs, UserID(id.UserID))
	return kvs
}
