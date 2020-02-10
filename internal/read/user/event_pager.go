package user

import (
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/user/queries"
)

// Cursor implements pager.Edge
func (e *Event) Cursor() pager.Cursor {
	return pager.Cursor(e.CreatedAt.UTC().Format(time.RFC3339))
}

type eventPager struct {
	UserID string
}

func (*eventPager) EdgesQuery() string {
	return queries.EventsPagerEdges
}

func (*eventPager) TotalQuery() string {
	return queries.EventsPagerTotal
}

func (p *eventPager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (*eventPager) OrderBy() (string, bool) {
	return "created_at", false
}

func (*eventPager) FromCursor(cursor pager.Cursor) interface{} {
	t, err := time.Parse(time.RFC3339, string(cursor))
	if err != nil {
		return nil
	}
	return &t
}

func (*eventPager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var row Event

	if err := rows.StructScan(&row); err != nil {
		return nil, err
	}

	return &row, nil
}
