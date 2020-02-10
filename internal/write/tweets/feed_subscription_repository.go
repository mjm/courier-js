package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type FeedSubscriptionRepository struct {
	db db.DB
}

func NewFeedSubscriptionRepository(db db.DB) *FeedSubscriptionRepository {
	return &FeedSubscriptionRepository{db: db}
}

func (r *FeedSubscriptionRepository) ByFeedID(ctx context.Context, feedID FeedID) ([]*FeedSubscription, error) {
	var subs []*FeedSubscription
	if err := r.db.SelectContext(ctx, &subs, queries.FeedSubscriptionsByFeedID, feedID); err != nil {
		return nil, err
	}

	return subs, nil
}

func (r *FeedSubscriptionRepository) Get(ctx context.Context, id FeedSubscriptionID) (*FeedSubscription, error) {
	var sub FeedSubscription
	if err := r.db.QueryRowxContext(ctx, queries.FeedSubscriptionsGet, id).StructScan(&sub); err != nil {
		return nil, err
	}

	return &sub, nil
}
