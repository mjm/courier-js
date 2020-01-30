package service

import (
	"context"
	"strconv"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/event"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/trace"
)

type TweetService struct {
	db *db.DB
}

func NewTweetService(db *db.DB) *TweetService {
	return &TweetService{
		db: db,
	}
}

// Cancel marks a tweet as canceled as long as it is not already posted. It also clears
// the post_after field to prevent the tweet from being autoposted if it is uncanceled
// later.
func (srv *TweetService) Cancel(ctx context.Context, id int) (*tweet.Tweet, error) {
	ctx = trace.Start(ctx, "Cancel tweet")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "tweet.id", id)

	l := loaders.Get(ctx)
	key := loader.IntKey(id)

	// check if the tweet is visible to the current user
	_, err := l.Tweets.Load(ctx, key)()
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	t, err := tweet.Cancel(ctx, srv.db, id)
	if err != nil {
		trace.Error(ctx, err)
	}
	l.Tweets.Clear(ctx, key).Prime(ctx, key, t)

	event.Record(ctx, srv.db, event.TweetCancel, event.Params{TweetID: strconv.Itoa(t.ID)})
	return t, nil
}
