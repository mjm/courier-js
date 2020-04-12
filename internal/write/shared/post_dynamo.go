package shared

import (
	"time"

	"github.com/mjm/courier-js/internal/write/feeds"
)

type PostDynamo struct {
	ID          feeds.PostID
	FeedID      feeds.FeedID
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
