package feed

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

// Create adds a new feed with the given URL to the database.
func Create(ctx context.Context, db *db.DB, url string) (*Feed, error) {
	var feed Feed
	if err := db.QueryRowxContext(ctx, `
		INSERT INTO feeds (
			url
		) VALUES (
			$1
		)
		RETURNING *
	`, url).StructScan(&feed); err != nil {
		return nil, err
	}

	return &feed, nil
}

// CreateSubscription adds a new subscription to a feed for a given user. If the user
// has subscribed to the feed before, their subscription is marked as not discarded.
func CreateSubscription(ctx context.Context, db *db.DB, userID string, feedID int) (*Subscription, error) {
	var sub Subscription
	if err := db.QueryRowxContext(ctx, `
		INSERT INTO feed_subscriptions (
			feed_id, user_id
		) VALUES (
			$1, $2
		)
		ON CONFLICT
			(feed_id, user_id)
		DO UPDATE
			SET discarded_at = NULL
		RETURNING *
	`, feedID, userID).StructScan(&sub); err != nil {
		return nil, err
	}

	return &sub, nil
}
