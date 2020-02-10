package tweets

import (
	"context"
	"errors"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/tweetevent"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/tweets/queries"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
)

// TweetQueries is an interface for reading information about a user's tweets.
type TweetQueries interface {
	// Get fetches a tweet by ID.
	Get(context.Context, TweetID) (*Tweet, error)
	// Paged fetches a paged and possibly filtered subset of a user's tweets.
	Paged(context.Context, string, Filter, pager.Options) (*pager.Connection, error)
}

type tweetQueries struct {
	db     db.DB
	loader *dataloader.Loader
}

// NewTweetQueries returns queries targeting a given database and event bus.
// The event bus is used to invalidate cached data when the write model makes changes.
func NewTweetQueries(db db.DB, eventBus *event.Bus) TweetQueries {
	q := &tweetQueries{
		db:     db,
		loader: newTweetLoader(db),
	}
	eventBus.Notify(q, tweetevent.TweetCanceled{}, tweetevent.TweetsUpdated{})
	return q
}

func newTweetLoader(db db.DB) *dataloader.Loader {
	return loader.New("Tweet Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		userID, err := auth.GetUser(ctx).ID()
		if err != nil {
			return nil
		}

		rows, err := db.QueryxContext(ctx, queries.TweetsLoad, userID, loader.StringArray(keys))
		if err != nil {
			panic(err)
		}
		return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
			var t Tweet
			if err := rows.StructScan(&t); err != nil {
				return nil, "", err
			}

			return &t, string(t.ID), nil
		})
	})
}

func (q *tweetQueries) Get(ctx context.Context, id TweetID) (*Tweet, error) {
	v, err := q.loader.Load(ctx, dataloader.StringKey(id))()
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrNoTweet
	}
	return v.(*Tweet), nil
}

func (q *tweetQueries) Paged(ctx context.Context, userID string, filter Filter, opts pager.Options) (*pager.Connection, error) {
	return pager.Paged(ctx, q.db, &tweetPager{Filter: filter, UserID: userID}, opts)
}

func (q *tweetQueries) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case tweetevent.TweetCanceled:
		q.loader.Clear(ctx, dataloader.StringKey(evt.TweetID))

	case tweetevent.TweetUncanceled:
		q.loader.Clear(ctx, dataloader.StringKey(evt.TweetID))

	case tweetevent.TweetsUpdated:
		for _, id := range evt.TweetIDs {
			q.loader.Clear(ctx, dataloader.StringKey(id))
		}

	}
}
