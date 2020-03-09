package feeds

import (
	"context"
	"errors"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/read/feeds/queries"
)

var (
	// ErrNoFeed is returned when a specific feed cannot be found.
	ErrNoFeed = errors.New("no feed found")
)

// FeedQueries is an interface for reading information about feeds.
type FeedQueries interface {
	// Get fetches a feed by ID.
	Get(context.Context, FeedID) (*Feed, error)

	ByHomePageURL(context.Context, string) ([]*Feed, error)
}

type feedQueries struct {
	db     db.DB
	loader *dataloader.Loader
}

func NewFeedQueries(db db.DB) FeedQueries {
	return &feedQueries{
		db:     db,
		loader: newFeedLoader(db),
	}
}

func newFeedLoader(db db.DB) *dataloader.Loader {
	return loader.New("Feed Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		rows, err := db.QueryxContext(ctx, queries.FeedsLoad, loader.StringArray(keys))
		if err != nil {
			panic(err)
		}
		return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
			var feed Feed
			if err := rows.StructScan(&feed); err != nil {
				return nil, "", err
			}

			return &feed, feed.ID.String(), nil
		})
	})
}

func (q *feedQueries) Get(ctx context.Context, id FeedID) (*Feed, error) {
	v, err := q.loader.Load(ctx, dataloader.StringKey(id))()
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrNoFeed
	}
	return v.(*Feed), nil
}

func (q *feedQueries) ByHomePageURL(ctx context.Context, url string) ([]*Feed, error) {
	var feeds []*Feed
	if err := q.db.SelectContext(ctx, &feeds, queries.FeedsByHomePageURL, url); err != nil {
		return nil, err
	}

	return feeds, nil
}
