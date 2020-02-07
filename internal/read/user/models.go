package user

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// Event is a high-level action that a user performed.
type Event struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	EventType Type      `db:"event_type"`
	Params    Params    `db:"parameters"`
	CreatedAt time.Time `db:"created_at"`
}

// Type is a distinct type of action that the event represents.
type Type string

// Feed-related event types.
const (
	FeedRefresh     Type = "feed_refresh"
	FeedSetAutopost Type = "feed_set_autopost"
	FeedSubscribe   Type = "feed_subscribe"
	FeedUnsubscribe Type = "feed_unsubscribe"
)

// Tweet-related event types.
const (
	TweetCancel   Type = "tweet_cancel"
	TweetUncancel Type = "tweet_uncancel"
	TweetEdit     Type = "tweet_edit"
	TweetPost     Type = "tweet_post"
	TweetAutopost Type = "tweet_autopost"
)

// Billing/subscription-related event types.
const (
	SubscriptionCreate     Type = "subscription_create"
	SubscriptionRenew      Type = "subscription_renew"
	SubscriptionCancel     Type = "subscription_cancel"
	SubscriptionReactivate Type = "subscription_reactivate"
	SubscriptionExpire     Type = "subscription_expire"
)

// Params are additional data about the event, like IDs of affected records.
type Params struct {
	FeedID             string `json:"feedId,omitempty"`
	FeedSubscriptionID string `json:"feedSubscriptionId,omitempty"`
	TweetID            string `json:"tweetId,omitempty"`
	ParamValue         *bool  `json:"value,omitempty"`
	SubscriptionID     string `json:"subscriptionId,omitempty"`
}

// Value implements driver.Value
func (p Params) Value() (driver.Value, error) {
	return json.Marshal(p)
}

// Scan implements sql.Scanner
func (p *Params) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("CachingHeaders must be scanned from []byte")
	}

	return json.Unmarshal(b, &p)
}
