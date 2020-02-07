package feeds

import (
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/pager"
)

type SubscriptionEdge struct {
	Subscription
	URL string `db:"url"`
}

func (e *SubscriptionEdge) Cursor() pager.Cursor {
	return pager.Cursor(e.URL)
}

type subscriptionPager struct {
	UserID string
}

var _ pager.Pager = (*subscriptionPager)(nil)

func (*subscriptionPager) EdgesQuery() string {
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

func (*subscriptionPager) TotalQuery() string {
	return `
		SELECT
			COUNT(*)
		FROM
			feed_subscriptions
		WHERE user_id = :user_id
			AND discarded_at IS NULL
	`
}

func (p *subscriptionPager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (*subscriptionPager) OrderBy() (string, bool) {
	return "url", true
}

func (*subscriptionPager) FromCursor(cursor pager.Cursor) interface{} {
	return string(cursor)
}

func (*subscriptionPager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var row SubscriptionEdge

	if err := rows.StructScan(&row); err != nil {
		return nil, err
	}

	return &row, nil
}
