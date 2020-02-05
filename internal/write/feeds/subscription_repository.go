package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
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
	if err := r.db.QueryRowxContext(ctx, `
		INSERT INTO feed_subscriptions (
			user_id, feed_id
		) VALUES (
			$1, $2
		)
		ON CONFLICT
			(feed_id, user_id)
		DO UPDATE
			SET discarded_at = NULL
		RETURNING id
	`, userID, feedID).Scan(&subID); err != nil {
		return 0, err
	}

	return subID, nil
}

// Deactivate marks a subscription as discarded. It still exists, but it won't generally
// be shown, nor will it cause tweets to be created.
func (r *SubscriptionRepository) Deactivate(ctx context.Context, userID string, subID int) error {
	if _, err := r.db.ExecContext(ctx, `
		UPDATE
			feed_subscriptions
		SET discarded_at = CURRENT_TIMESTAMP
		WHERE user_id = $1
			AND id = $2
	`, userID, subID); err != nil {
		return err
	}

	return nil
}
