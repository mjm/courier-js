package feeds

import (
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds/queries"
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
	return queries.SubscriptionsPagerEdges
}

func (*subscriptionPager) TotalQuery() string {
	return queries.SubscriptionsPagerTotal
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
