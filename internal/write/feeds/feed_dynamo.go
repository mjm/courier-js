package feeds

import (
	"time"
)

type FeedDynamo struct {
	ID               FeedID
	UserID           string
	URL              string
	Title            string
	HomePageURL      string
	RefreshedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	CachingHeaders   *CachingHeaders
	MicropubEndpoint string
	Autopost         bool
}
