package tweet

import (
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/mjm/courier-js/internal/pager"
	"time"
)

type Filter string

const (
	NoFilter       Filter = ""
	UpcomingFilter Filter = "UPCOMING"
	PastFilter     Filter = "PAST"
)

type Pager struct {
	UserID string
	Filter Filter
}

var _ pager.Pager = (*Pager)(nil)

func (p *Pager) EdgesQuery() string {
	return `
		SELECT tweets.*,
					 posts.published_at
			FROM tweets
			JOIN posts
				ON tweets.post_id = posts.id
			JOIN feed_subscriptions
				ON tweets.feed_subscription_id = feed_subscriptions.id
		 WHERE feed_subscriptions.user_id = :user_id
	` + p.filterCondition()
}

func (p *Pager) TotalQuery() string {
	return `
		SELECT COUNT(*)
			FROM tweets
			JOIN feed_subscriptions
				ON tweets.feed_subscription_id = feed_subscriptions.id
		 WHERE feed_subscriptions.user_id = :user_id
	` + p.filterCondition()
}

func (p *Pager) filterCondition() string {
	switch p.Filter {
	case UpcomingFilter:
		return " AND tweets.status = 'draft'"
	case PastFilter:
		return " AND tweets.status <> 'draft'"
	}

	return ""
}

func (p *Pager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (p *Pager) OrderBy() (string, bool) {
	return "published_at", false
}

func (p *Pager) FromCursor(cursor pager.Cursor) interface{} {
	// TODO maybe this should be a time
	return string(cursor)
}

func (p *Pager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var edge pager.Edge
	var row struct {
		Tweet
		PublishedAt pq.NullTime `db:"published_at"`
	}

	if err := rows.StructScan(&row); err != nil {
		return edge, err
	}

	edge.Node = &row.Tweet
	if row.PublishedAt.Valid {
		edge.Cursor = pager.Cursor(row.PublishedAt.Time.UTC().Format(time.RFC3339))
	}
	return edge, nil
}
