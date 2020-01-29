package feed

import (
	"time"

	"github.com/lib/pq"
)

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
