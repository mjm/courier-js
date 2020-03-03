package feeds

import (
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds/queries"
)

type postPager struct {
	feedID FeedID
}

func (p *postPager) EdgesQuery() string {
	return queries.PostsPagerEdges
}

func (p *postPager) TotalQuery() string {
	return queries.PostsPagerTotal
}

func (p *postPager) Params() map[string]interface{} {
	return map[string]interface{}{
		"feed_id": p.feedID,
	}
}

func (p *postPager) OrderBy() (string, bool) {
	return "published_at", false
}

func (p *postPager) FromCursor(value pager.Cursor) interface{} {
	return string(value)
}

func (p *postPager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var post Post
	if err := rows.StructScan(&post); err != nil {
		return nil, err
	}

	return &post, nil
}

func (p *Post) Cursor() pager.Cursor {
	if !p.PublishedAt.Valid {
		return ""
	}
	return pager.Cursor(p.PublishedAt.Time.Format(time.RFC3339))
}
