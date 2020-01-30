package feed

import (
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/pager"
)

type SubscriptionPager struct {
	UserID string
}

var _ pager.Pager = (*SubscriptionPager)(nil)

func (*SubscriptionPager) EdgesQuery() string {
	return `
		SELECT
			feed_subscriptions.*,
			feeds.url
		FROM
			feed_subscriptions
			JOIN feeds ON feed_subscriptions.feed_id = feeds.id
		WHERE user_id = :user_id
			AND discarded_at IS NULL
	`
}

func (*SubscriptionPager) TotalQuery() string {
	return `
		SELECT
			COUNT(*)
		FROM
			feed_subscriptions
		WHERE user_id = :user_id
			AND discarded_at IS NULL
	`
}

func (p *SubscriptionPager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (*SubscriptionPager) OrderBy() (string, bool) {
	return "url", true
}

func (*SubscriptionPager) FromCursor(cursor pager.Cursor) interface{} {
	return string(cursor)
}

func (*SubscriptionPager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var edge pager.Edge
	var row struct {
		Subscription
		URL string
	}

	if err := rows.StructScan(&row); err != nil {
		return edge, err
	}

	edge.Node = &row.Subscription
	edge.Cursor = pager.Cursor(row.URL)
	return edge, nil
}
