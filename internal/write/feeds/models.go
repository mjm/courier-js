package feeds

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/lib/pq"
)

// Feed represents a URL that serves some kind of feed with posts. Feed captures our current
// understanding of the state of that feed's contents.
//
// A feed is shared between all users who are subscribed to it, so we keep a single version
// of the posts in a feed.
type Feed struct {
	ID             int             `db:"id"`
	URL            string          `db:"url"`
	Title          string          `db:"title"`
	HomePageURL    string          `db:"home_page_url"`
	RefreshedAt    pq.NullTime     `db:"refreshed_at"`
	CreatedAt      time.Time       `db:"created_at"`
	UpdatedAt      time.Time       `db:"updated_at"`
	CachingHeaders *CachingHeaders `db:"caching_headers"`
	MPEndpoint     string          `db:"mp_endpoint"`
}

// CachingHeaders are HTTP headers that a feed can provide when we request it that allow us
// to take advantage of caching. These headers are stored on the feed, so the next time we
// fetch it, we provide the values and are possibly able to avoid reprocessing the feed at
// all.
type CachingHeaders struct {
	Etag         string `json:"etag,omitempty"`
	LastModified string `json:"lastModified,omitempty"`
}

// Value implements driver.Value.
func (h CachingHeaders) Value() (driver.Value, error) {
	return json.Marshal(h)
}

// Scan implements sql.Scanner.
func (h *CachingHeaders) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("CachingHeaders must be scanned from []byte")
	}

	return json.Unmarshal(b, &h)
}

// Subscription represents a single user's subscription to a Feed. It includes user-specific
// settings about the feed, and it also links generated tweets to the feed and the user.
//
// Because it is the connection between a user and their tweets, if the user wants to delete
// a subscription to a feed, we don't actually delete it, but instead mark it as discarded,
// so that their tweets don't become unliked from their account.
type Subscription struct {
	ID          int         `db:"id"`
	FeedID      int         `db:"feed_id"`
	UserID      string      `db:"user_id"`
	Autopost    bool        `db:"autopost"`
	CreatedAt   time.Time   `db:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at"`
	DiscardedAt pq.NullTime `db:"discarded_at"`
}

// Post is a single entry from a feed. A Post is shared between all users that are subscribed
// to a feed.
type Post struct {
	ID          int         `db:"id"`
	FeedID      int         `db:"feed_id"`
	ItemID      string      `db:"item_id"`
	TextContent string      `db:"text_content"`
	HTMLContent string      `db:"html_content"`
	Title       string      `db:"title"`
	URL         string      `db:"url"`
	PublishedAt pq.NullTime `db:"published_at"`
	ModifiedAt  pq.NullTime `db:"modified_at"`
	CreatedAt   time.Time   `db:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at"`
}
