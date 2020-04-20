package tweets

import (
	"context"
	"errors"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/pkg/htmltweets"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
)

// TweetQueries is an interface for reading information about a user's tweets.
type TweetQueries interface {
	// Paged fetches a paged and possibly filtered subset of a user's tweets.
	Paged(context.Context, string, Filter, pager.Options) (*pager.Connection, error)
	GeneratePreviews(context.Context, PreviewPost) ([]*PreviewTweet, error)
}

type tweetQueries struct {
	db db.DB
}

func NewTweetQueries(db db.DB) TweetQueries {
	return &tweetQueries{
		db: db,
	}
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
