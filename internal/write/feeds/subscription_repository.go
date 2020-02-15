package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/write/feeds/queries"
)

// SubscriptionRepository fetches and stores information about feed subscriptions.
type SubscriptionRepository struct {
	db db.DB
}

// NewSubscriptionRepository creates a new subscription repository targeting a given database.
func NewSubscriptionRepository(db db.DB) *SubscriptionRepository {
	return &SubscriptionRepository{db: db}
}

// Create adds a new subscription to a feed for a user to the database.
func (r *SubscriptionRepository) Create(ctx context.Context, userID string, feedID FeedID) (SubscriptionID, error) {
	subID := feeds.NewSubscriptionID()
	if err := r.db.QueryRowxContext(ctx, queries.SubscriptionsCreate, subID, userID, feedID).Scan(&subID); err != nil {
		return subID, err
	}

	return subID, nil
}

type UpdateSubscriptionParams struct {
	ID       SubscriptionID
	Autopost bool
}

func (r *SubscriptionRepository) Update(ctx context.Context, userID string, params UpdateSubscriptionParams) error {
	if _, err := r.db.ExecContext(ctx, queries.SubscriptionsUpdate, params.ID, userID, params.Autopost); err != nil {
		return err
	}
	return nil
}

// Deactivate marks a subscription as discarded. It still exists, but it won't generally
// be shown, nor will it cause tweets to be created.
func (r *SubscriptionRepository) Deactivate(ctx context.Context, userID string, subID SubscriptionID) error {
	if _, err := r.db.ExecContext(ctx, queries.SubscriptionsDeactivate, userID, subID); err != nil {
		return err
	}

	return nil
}
