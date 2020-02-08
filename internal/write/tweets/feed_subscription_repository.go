package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

type FeedSubscription struct {
	ID       int    `db:"id"`
	FeedID   int    `db:"feed_id"`
	UserID   string `db:"user_id"`
	Autopost bool   `db:"autopost"`
}

type FeedSubscriptionRepository struct {
	db db.DB
}

func NewFeedSubscriptionRepository(db db.DB) *FeedSubscriptionRepository {
	return &FeedSubscriptionRepository{db: db}
}

func (r *FeedSubscriptionRepository) ByFeedID(ctx context.Context, feedID int) ([]*FeedSubscription, error) {
	rows, err := r.db.QueryxContext(ctx, `
		SELECT
			id,
			feed_id,
			user_id,
			autopost
		FROM
			feed_subscriptions
		WHERE	feed_id = $1
	`, feedID)
	if err != nil {
		return nil, err
	}

	var subs []*FeedSubscription
	for rows.Next() {
		var sub FeedSubscription
		if err := rows.StructScan(&sub); err != nil {
			return nil, err
		}

		subs = append(subs, &sub)
	}
	return subs, nil
}
