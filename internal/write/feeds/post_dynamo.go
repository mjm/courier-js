package feeds

import (
	"time"
)

type PostDynamo struct {
	ID          PostID
	FeedID      FeedID
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
