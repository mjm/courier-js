package feed

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

// ByURL gets the feed with a given URL. Returns sql.ErrNoRows if no such feed exists.
func ByURL(ctx context.Context, db *db.DB, url string) (*Feed, error) {
	var feed Feed
	if err := db.QueryRowxContext(ctx, `
		SELECT * FROM feeds WHERE url = $1
	`, url).StructScan(&feed); err != nil {
		return nil, err
	}

	return &feed, nil
}

// GetSubscriptionEdge constructs a pager edge for a particular feed subscription.
func GetSubscriptionEdge(ctx context.Context, db *db.DB, id int) (pager.Edge, error) {
	var row struct {
		Subscription
		URL string `db:"url"`
	}
	if err := db.QueryRowxContext(ctx, `
		SELECT
			feed_subscriptions.*,
			feeds.url
		FROM
			feed_subscriptions
			JOIN feeds ON feed_subscriptions.feed_id = feeds.id
		WHERE
			feed_subscriptions.id = $1
	`, id).StructScan(&row); err != nil {
		return pager.Edge{}, nil
	}

	return pager.Edge{
		Node:   &row.Subscription,
		Cursor: pager.Cursor(row.URL),
	}, nil
}

// Subscriptions gets all of the active subscriptions for a particular feed.
func Subscriptions(ctx context.Context, db *db.DB, feedID int) ([]*Subscription, error) {
	rows, err := db.QueryxContext(ctx, `
		SELECT
			*
		FROM
			feed_subscriptions
		WHERE feed_id = $1
		  AND discarded_at IS NULL
	`, feedID)
	if err != nil {
		return nil, err
	}

	var subs []*Subscription
	for rows.Next() {
		var sub Subscription
		if err := rows.StructScan(&sub); err != nil {
			return nil, err
		}
		subs = append(subs, &sub)
	}
	return subs, nil
}
