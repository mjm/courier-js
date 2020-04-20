package tweets

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/HnH/qry"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")

	ErrNotDraft = errors.New("tweet is not a draft")
)

// TweetRepository fetches and stores information about tweets.
type TweetRepository struct {
	db db.DB
}

// NewTweetRepository creates a new tweet repository targeting a given database.
func NewTweetRepository(db db.DB) *TweetRepository {
	return &TweetRepository{db: db}
}

func (r *TweetRepository) Get(ctx context.Context, userID string, tweetID TweetID) (*Tweet, error) {
	var tweet Tweet
	if err := r.db.QueryRowxContext(ctx, queries.TweetsGet, userID, tweetID).StructScan(&tweet); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNoTweet
		}
		return nil, err
	}

	return &tweet, nil
}

func (r *TweetRepository) QueuePost(ctx context.Context, tweetID TweetID, taskName string) error {
	res, err := r.db.ExecContext(ctx, queries.TweetsQueuePost, tweetID, taskName)
	if err != nil {
		return err
	}

	n, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if n == 0 {
		return ErrNoTweet
	}

	return nil
}

type UpdateTweetParams struct {
	ID        TweetID
	Action    TweetAction
	Body      string
	MediaURLs []string
	RetweetID string
}

func (r *TweetRepository) Update(ctx context.Context, ts []UpdateTweetParams) error {
	// avoid a query if there are no values
	if len(ts) == 0 {
		return nil
	}

	emptyMediaURLs := []byte("[]")
	u := db.NewUnnester("uuid", "tweet_action", "text", "json", "text")
	for _, t := range ts {
		mediaURLs := emptyMediaURLs
		if len(t.MediaURLs) > 0 {
			var err error
			mediaURLs, err = json.Marshal(t.MediaURLs)
			if err != nil {
				return err
			}
		}
		u.AppendRow(t.ID, t.Action, t.Body, mediaURLs, t.RetweetID)
	}

	q := qry.Query(queries.TweetsUpdate).Replace("__unnested__", u.Unnest())
	_, err := r.db.ExecContext(ctx, string(q), u.Values()...)
	if err != nil {
		return err
	}

	return nil
}
