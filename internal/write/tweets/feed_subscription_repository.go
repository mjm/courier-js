package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

type FeedSubscriptionRepository struct {
	db db.DB
}

func NewFeedSubscriptionRepository(db db.DB) *FeedSubscriptionRepository {
	return &FeedSubscriptionRepository{db: db}
}

func (r *FeedSubscriptionRepository) Get(ctx context.Context, id feeds.SubscriptionID) (*FeedSubscription, error) {
	var sub FeedSubscription
	if err := r.db.QueryRowxContext(ctx, queries.FeedSubscriptionsGet, id).StructScan(&sub); err != nil {
		return nil, err
	}

	return &sub, nil
}
