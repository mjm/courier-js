package user

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// Event is a high-level action that a user performed.
type Event struct {
	ID        int         `db:"id"`
	UserID    string      `db:"user_id"`
	EventType EventType   `db:"event_type"`
	Params    EventParams `db:"parameters"`
	CreatedAt time.Time   `db:"created_at"`
}

// EventType is a distinct type of action that the event represents.
type EventType string

// Feed-related event types.
const (
	FeedRefresh     EventType = "feed_refresh"
	FeedSetAutopost EventType = "feed_set_autopost"
	FeedSubscribe   EventType = "feed_subscribe"
	FeedUnsubscribe EventType = "feed_unsubscribe"
)

// Tweet-related event types.
const (
	TweetCancel   EventType = "tweet_cancel"
	TweetUncancel EventType = "tweet_uncancel"
	TweetEdit     EventType = "tweet_edit"
	TweetPost     EventType = "tweet_post"
	TweetAutopost EventType = "tweet_autopost"
)

// Billing/subscription-related event types.
const (
	SubscriptionCreate     EventType = "subscription_create"
	SubscriptionRenew      EventType = "subscription_renew"
	SubscriptionCancel     EventType = "subscription_cancel"
	SubscriptionReactivate EventType = "subscription_reactivate"
	SubscriptionExpire     EventType = "subscription_expire"
)

// EventParams are additional data about the event, like IDs of affected records.
type EventParams struct {
	FeedID             string `json:"feedId,omitempty"`
	FeedSubscriptionID string `json:"feedSubscriptionId,omitempty"`
	TweetID            string `json:"tweetId,omitempty"`
	ParamValue         *bool  `json:"value,omitempty"`
	SubscriptionID     string `json:"subscriptionId,omitempty"`
}

func (p EventParams) Value() (driver.Value, error) {
	return json.Marshal(p)
}

func (p *EventParams) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("EventParams must be scanned from []byte")
	}

	return json.Unmarshal(b, &p)
}
