package tweets

type FeedSubscription struct {
	ID       FeedSubscriptionID `db:"guid"`
	FeedID   FeedID             `db:"feed_guid"`
	UserID   string             `db:"user_id"`
	Autopost bool               `db:"autopost"`
}

type FeedSubscriptionID string
type FeedID string
