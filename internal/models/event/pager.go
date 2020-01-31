package event

import (
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/mjm/courier-js/internal/pager"
)

type Pager struct {
	UserID string
}

var _ pager.Pager = (*Pager)(nil)

func (*Pager) EdgesQuery() string {
	return `
		SELECT
			*
		FROM
			events
		WHERE user_id = :user_id
	`
}

func (*Pager) TotalQuery() string {
	return `
		SELECT
			COUNT(*)
		FROM
			events
		WHERE user_id = :user_id
	`
}

func (p *Pager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (*Pager) OrderBy() (string, bool) {
	return "created_at", false
}

func (*Pager) FromCursor(cursor pager.Cursor) interface{} {
	t, err := time.Parse(time.RFC3339, string(cursor))
	if err != nil {
		return nil
	}
	return &t
}

func (*Pager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var edge pager.Edge
	var row Event

	if err := rows.StructScan(&row); err != nil {
		return edge, err
	}

	edge.Node = &row
	edge.Cursor = pager.Cursor(row.CreatedAt.UTC().Format(time.RFC3339))
	return edge, nil
}
