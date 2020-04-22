package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

// PostQueries is an interface for reading information about posts.
type PostQueries interface {
	// Get fetches a post by ID.
	Paged(context.Context, FeedID, pager.Options) (*pager.Connection, error)
}

type postQueries struct {
	db db.DB
}

func NewPostQueries(db db.DB) PostQueries {
	return &postQueries{
		db: db,
	}
}

func (q *postQueries) Paged(ctx context.Context, feedID FeedID, opts pager.Options) (*pager.Connection, error) {
	return pager.Paged(ctx, q.db, &postPager{feedID: feedID}, opts)
}
