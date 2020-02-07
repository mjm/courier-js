package tweets

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/pager"
)

// Filter is a predefined filter for which tweets to list in the pager.
type Filter string

const (
	// NoFilter shows all tweets without exclusions.
	NoFilter Filter = ""
	// UpcomingFilter shows only draft tweets.
	UpcomingFilter Filter = "UPCOMING"
	// PastFilter shows only canceld and posted tweets.
	PastFilter Filter = "PAST"
)

// TweetEdge is a tweet that includes its cursor value for paging. Since tweets are ordered
// by the publish date of the post, this needs to be fetched with a join to pull the publish
// timestamp from the tweet's post.
type TweetEdge struct {
	Tweet
	PublishedAt pq.NullTime `db:"published_at"`
}

// Cursor implements pager.Edge
func (e *TweetEdge) Cursor() pager.Cursor {
	if e.PublishedAt.Valid {
		return pager.Cursor(e.PublishedAt.Time.UTC().Format(time.RFC3339))
	}
	return pager.Cursor("")
}

type tweetPager struct {
	UserID string
	Filter Filter
}

func (p *tweetPager) EdgesQuery() string {
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

func (p *tweetPager) TotalQuery() string {
	return `
		SELECT COUNT(*)
			FROM tweets
			JOIN feed_subscriptions
				ON tweets.feed_subscription_id = feed_subscriptions.id
		 WHERE feed_subscriptions.user_id = :user_id
	` + p.filterCondition()
}

func (p *tweetPager) filterCondition() string {
	switch p.Filter {
	case UpcomingFilter:
		return " AND tweets.status = 'draft'"
	case PastFilter:
		return " AND tweets.status <> 'draft'"
	}

	return ""
}

func (p *tweetPager) Params() map[string]interface{} {
	return map[string]interface{}{
		"user_id": p.UserID,
	}
}

func (*tweetPager) OrderBy() (string, bool) {
	return "published_at", false
}

func (*tweetPager) FromCursor(cursor pager.Cursor) interface{} {
	// TODO maybe this should be a time
	return string(cursor)
}

func (p *tweetPager) ScanEdge(rows *sqlx.Rows) (pager.Edge, error) {
	var row TweetEdge

	if err := rows.StructScan(&row); err != nil {
		return nil, err
	}

	return &row, nil
}
