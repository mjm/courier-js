package shared

import (
	"time"

	"github.com/mjm/courier-js/internal/write/feeds"
)

type FeedDynamo struct {
	ID               feeds.FeedID
	UserID           string
	URL              string
	Title            string
	HomePageURL      string
	RefreshedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	CachingHeaders   *feeds.CachingHeaders
	MicropubEndpoint string
	Autopost         bool
}
