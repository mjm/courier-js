package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type FeedSubscription struct {
	ID       int    `db:"id"`
	FeedID   FeedID `db:"feed_guid"`
	UserID   string `db:"user_id"`
	Autopost bool   `db:"autopost"`
}

type FeedID string

type FeedSubscriptionRepository struct {
	db db.DB
}

func NewFeedSubscriptionRepository(db db.DB) *FeedSubscriptionRepository {
	return &FeedSubscriptionRepository{db: db}
}

func (r *FeedSubscriptionRepository) ByFeedID(ctx context.Context, feedID FeedID) ([]*FeedSubscription, error) {
	rows, err := r.db.QueryxContext(ctx, queries.FeedSubscriptionsByFeedID, feedID)
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

func (r *FeedSubscriptionRepository) Get(ctx context.Context, id int) (*FeedSubscription, error) {
	var sub FeedSubscription
	if err := r.db.QueryRowxContext(ctx, queries.FeedSubscriptionsGet, id).StructScan(&sub); err != nil {
		return nil, err
	}

	return &sub, nil
}
