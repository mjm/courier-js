package feeds

import (
	"context"
	"errors"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds/queries"
)

var (
	// ErrNoPost is returned when a specific post cannot be found.
	ErrNoPost = errors.New("no post found")
)

// PostQueries is an interface for reading information about posts.
type PostQueries interface {
	// Get fetches a post by ID.
	Get(context.Context, PostID) (*Post, error)
	Paged(context.Context, FeedID, pager.Options) (*pager.Connection, error)
}

type postQueries struct {
	db     db.DB
	loader *dataloader.Loader
}

// NewPostQueries returns queries targeting a given database and event bus. The event bus
// is used to invalidate cached data when the write model makes changes.
func NewPostQueries(db db.DB, eventBus *event.Bus) PostQueries {
	q := &postQueries{
		db:     db,
		loader: newPostLoader(db),
	}
	// eventBus.Notify(q, feeds.FeedRefreshed{})
	return q
}

func newPostLoader(db db.DB) *dataloader.Loader {
	return loader.New("Post Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		rows, err := db.QueryxContext(ctx, queries.PostsLoad, loader.StringArray(keys))
		if err != nil {
			panic(err)
		}
		return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
			var post Post
			if err := rows.StructScan(&post); err != nil {
				return nil, "", err
			}

			return &post, string(post.ID), nil
		})
	})
}

func (q *postQueries) Get(ctx context.Context, id PostID) (*Post, error) {
	v, err := q.loader.Load(ctx, dataloader.StringKey(id))()
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrNoPost
	}
	return v.(*Post), nil
}

func (q *postQueries) Paged(ctx context.Context, feedID FeedID, opts pager.Options) (*pager.Connection, error) {
	return pager.Paged(ctx, q.db, &postPager{feedID: feedID}, opts)
}
