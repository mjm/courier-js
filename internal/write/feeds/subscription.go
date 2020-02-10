package feeds

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// Subscription represents a single user's subscription to a Feed. It includes user-specific
// settings about the feed, and it also links generated tweets to the feed and the user.
//
// Because it is the connection between a user and their tweets, if the user wants to delete
// a subscription to a feed, we don't actually delete it, but instead mark it as discarded,
// so that their tweets don't become unliked from their account.
type Subscription struct {
	ID          SubscriptionID `db:"id"`
	FeedID      FeedID         `db:"feed_guid"`
	UserID      string         `db:"user_id"`
	Autopost    bool           `db:"autopost"`
	CreatedAt   time.Time      `db:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at"`
	DiscardedAt pq.NullTime    `db:"discarded_at"`

	Unused_ID     int  `db:"id"`
	Unused_FeedID *int `db:"feed_id"`
}

type SubscriptionID string

func NewFeedSubscriptionID() SubscriptionID {
	return SubscriptionID(uuid.New().String())
}

func (id SubscriptionID) String() string {
	return string(id)
}
