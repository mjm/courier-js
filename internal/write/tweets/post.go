package tweets

import (
	"github.com/lib/pq"
)

type Post struct {
	ID          PostID      `db:"guid"`
	ItemID      string      `db:"item_id"`
	TextContent string      `db:"text_content"`
	HTMLContent string      `db:"html_content"`
	Title       string      `db:"title"`
	URL         string      `db:"url"`
	PublishedAt pq.NullTime `db:"published_at"`
	ModifiedAt  pq.NullTime `db:"modified_at"`
}

type PostID string
