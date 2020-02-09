package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
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
func (r *SubscriptionRepository) Create(ctx context.Context, userID string, feedID int) (int, error) {
	var subID int
	if err := r.db.QueryRowxContext(ctx, queries.SubscriptionsCreate, userID, feedID).Scan(&subID); err != nil {
		return 0, err
	}

	return subID, nil
}

// Deactivate marks a subscription as discarded. It still exists, but it won't generally
// be shown, nor will it cause tweets to be created.
func (r *SubscriptionRepository) Deactivate(ctx context.Context, userID string, subID int) error {
	if _, err := r.db.ExecContext(ctx, queries.SubscriptionsDeactivate, userID, subID); err != nil {
		return err
	}

	return nil
}
