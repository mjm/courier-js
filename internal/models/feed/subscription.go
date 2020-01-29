package feed

import (
	"time"

	"github.com/lib/pq"
)

type Subscription struct {
	ID          int         `db:"id"`
	FeedID      int         `db:"feed_id"`
	UserID      string      `db:"user_id"`
	Autopost    bool        `db:"autopost"`
	CreatedAt   time.Time   `db:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at"`
	DiscardedAt pq.NullTime `db:"discarded_at"`
}
