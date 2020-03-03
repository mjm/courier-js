package tweets

import (
	"github.com/mjm/courier-js/internal/shared/feeds"
)

type FeedSubscription struct {
	ID       feeds.SubscriptionID `db:"guid"`
	FeedID   feeds.FeedID         `db:"feed_guid"`
	UserID   string               `db:"user_id"`
	Autopost bool                 `db:"autopost"`
}
