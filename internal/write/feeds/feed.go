package feeds

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// Feed represents a URL that serves some kind of feed with posts. Feed captures our current
// understanding of the state of that feed's contents.
//
// A feed is shared between all users who are subscribed to it, so we keep a single version
// of the posts in a feed.
type Feed struct {
	ID             FeedID          `db:"guid"`
	URL            string          `db:"url"`
	Title          string          `db:"title"`
	HomePageURL    string          `db:"home_page_url"`
	RefreshedAt    pq.NullTime     `db:"refreshed_at"`
	CreatedAt      time.Time       `db:"created_at"`
	UpdatedAt      time.Time       `db:"updated_at"`
	CachingHeaders *CachingHeaders `db:"caching_headers"`
	MPEndpoint     string          `db:"mp_endpoint"`

	Unused_ID int `db:"id"`
}

type FeedID string

func NewFeedID() FeedID {
	return FeedID(uuid.New().String())
}

func (id FeedID) String() string {
	return string(id)
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
