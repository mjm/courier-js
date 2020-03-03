package tweets

import (
	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/shared/feeds"
)

type Post struct {
	ID          feeds.PostID `db:"guid"`
	ItemID      string       `db:"item_id"`
	TextContent string       `db:"text_content"`
	HTMLContent string       `db:"html_content"`
	Title       string       `db:"title"`
	URL         string       `db:"url"`
	PublishedAt pq.NullTime  `db:"published_at"`
	ModifiedAt  pq.NullTime  `db:"modified_at"`
}
