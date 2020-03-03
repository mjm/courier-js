package tweets

import (
	"context"
	"errors"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/tweets/queries"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/pkg/htmltweets"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
)

// TweetQueries is an interface for reading information about a user's tweets.
type TweetQueries interface {
	// Get fetches a tweet by ID.
	Get(context.Context, TweetID) (*Tweet, error)
	PrivilegedGet(context.Context, TweetID) (*Tweet, error)
	// Paged fetches a paged and possibly filtered subset of a user's tweets.
	Paged(context.Context, string, Filter, pager.Options) (*pager.Connection, error)
	GeneratePreviews(context.Context, PreviewPost) ([]*PreviewTweet, error)
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
	eventBus.Notify(q,
		tweets.TweetCanceled{},
		tweets.TweetUncanceled{},
		tweets.TweetEdited{},
		tweets.TweetsImported{},
	)
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

func (q *tweetQueries) PrivilegedGet(ctx context.Context, id TweetID) (*Tweet, error) {
	var tweet Tweet
	if err := q.db.QueryRowxContext(ctx, queries.TweetsPrivilegedGet, id).StructScan(&tweet); err != nil {
		return nil, err
	}

	return &tweet, nil
}

func (q *tweetQueries) Paged(ctx context.Context, userID string, filter Filter, opts pager.Options) (*pager.Connection, error) {
	return pager.Paged(ctx, q.db, &tweetPager{Filter: filter, UserID: userID}, opts)
}

type PreviewPost struct {
	URL         string
	Title       string
	HTMLContent string
}

type PreviewTweet struct {
	Action    TweetAction
	Body      string
	MediaURLs []string
	RetweetID string
}

func (q *tweetQueries) GeneratePreviews(_ context.Context, p PreviewPost) ([]*PreviewTweet, error) {
	translated, err := htmltweets.Translate(htmltweets.Input{
		Title: p.Title,
		URL:   p.URL,
		HTML:  p.HTMLContent,
	})
	if err != nil {
		return nil, err
	}

	// add the tweets in reverse order, so the last ones come first
	var ts []*PreviewTweet
	for i := len(translated) - 1; i >= 0; i-- {
		t := translated[i]
		ts = append(ts, &PreviewTweet{
			Action:    TweetAction(t.Action),
			Body:      t.Body,
			MediaURLs: t.MediaURLs,
			RetweetID: t.RetweetID,
		})
	}

	return ts, nil
}

func (q *tweetQueries) HandleEvent(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case tweets.TweetCanceled:
		q.loader.Clear(ctx, dataloader.StringKey(evt.TweetId))

	case tweets.TweetUncanceled:
		q.loader.Clear(ctx, dataloader.StringKey(evt.TweetId))

	case tweets.TweetEdited:
		q.loader.Clear(ctx, dataloader.StringKey(evt.TweetId))

	case tweets.TweetsImported:
		for _, id := range evt.CreatedTweetIds {
			q.loader.Clear(ctx, dataloader.StringKey(id))
		}
		for _, id := range evt.UpdatedTweetIds {
			q.loader.Clear(ctx, dataloader.StringKey(id))
		}

	}
}
