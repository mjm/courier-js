package feeds

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/loader"
)

// FeedQueries is an interface for reading information about feeds.
type FeedQueries interface {
	// Get fetches a feed by ID.
	Get(context.Context, int) (*Feed, error)
}

type feedQueries struct {
	db     db.DB
	loader *dataloader.Loader
}

// NewFeedQueries returns queries targeting a given database and event bus. The event bus
// is used to invalidate cached data when the write model makes changes.
func NewFeedQueries(db db.DB, eventBus *event.Bus) FeedQueries {
	q := &feedQueries{
		db:     db,
		loader: newFeedLoader(db),
	}
	eventBus.Notify(q, feedevent.FeedRefreshed{})
	return q
}

const feedLoaderQuery = `SELECT * FROM feeds WHERE id = ANY($1)`

func newFeedLoader(db db.DB) *dataloader.Loader {
	return loader.New("Feed Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		rows, _ := db.QueryxContext(ctx, feedLoaderQuery, loader.IntArray(keys))
		return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
			var feed Feed
			if err := rows.StructScan(&feed); err != nil {
				return nil, "", err
			}

			return &feed, strconv.Itoa(feed.ID), nil
		})
	})
}

func (q *feedQueries) Get(ctx context.Context, id int) (*Feed, error) {
	v, err := q.loader.Load(ctx, loader.IntKey(id))()
	if err != nil {
		return nil, err
	}
	return v.(*Feed), nil
}

func (q *feedQueries) Handle(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case feedevent.FeedRefreshed:
		q.loader.Clear(ctx, loader.IntKey(evt.FeedID))

	}
}