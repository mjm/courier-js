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

// Deactivate marks a subscription as discarded. It still exists, but it won't generally
// be shown, nor will it cause tweets to be created.
func (r *SubscriptionRepository) Deactivate(ctx context.Context, userID string, subID SubscriptionID) error {
	if _, err := r.db.ExecContext(ctx, queries.SubscriptionsDeactivate, userID, subID); err != nil {
		return err
	}

	return nil
}
