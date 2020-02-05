package feed

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
)

// Create adds a new feed with the given URL to the database.
func Create(ctx context.Context, db db.DB, url string) (*Feed, error) {
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

// Update saves changes to the metadata of a feed when it is refreshed.
func Update(ctx context.Context, db db.DB, f *Feed) (*Feed, error) {
	var feed Feed
	if err := db.QueryRowxContext(ctx, `
		UPDATE
			feeds
		SET
			title = $1,
			home_page_url = $2,
			caching_headers = $3,
			mp_endpoint = $4,
			refreshed_at = CURRENT_TIMESTAMP,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING *
	`, f.Title, f.HomePageURL, f.CachingHeaders, f.MPEndpoint, f.ID).StructScan(&feed); err != nil {
		return nil, err
	}

	return &feed, nil
}

// CreateSubscription adds a new subscription to a feed for a given user. If the user
// has subscribed to the feed before, their subscription is marked as not discarded.
func CreateSubscription(ctx context.Context, db db.DB, userID string, feedID int) (*Subscription, error) {
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

// DeleteSubscription marks a feed subscription as discarded, so it will no longer show
// up for the user. It remains around so tweets can still reference it and stay connected
// to the user.
func DeleteSubscription(ctx context.Context, db db.DB, userID string, subID int) error {
	_, err := db.ExecContext(ctx, `
		UPDATE
			feed_subscriptions
		SET discarded_at = CURRENT_TIMESTAMP
		WHERE id = $1
		  AND user_id = $2
	`, subID, userID)
	return err
}
