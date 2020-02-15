package feeds

import (
	"time"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/write/feeds"
)

// Post is a single entry from a feed. A Post is shared between all users that are subscribed
// to a feed.
type Post struct {
	ID          PostID      `db:"guid"`
	FeedID      FeedID      `db:"feed_guid"`
	ItemID      string      `db:"item_id"`
	TextContent string      `db:"text_content"`
	HTMLContent string      `db:"html_content"`
	Title       string      `db:"title"`
	URL         string      `db:"url"`
	PublishedAt pq.NullTime `db:"published_at"`
	ModifiedAt  pq.NullTime `db:"modified_at"`
	CreatedAt   time.Time   `db:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at"`

	Unused_ID     int  `db:"id"`
	Unused_FeedID *int `db:"feed_id"`
}

type PostID = feeds.PostID