package resolvers

import (
	"context"
	"fmt"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/trace"
)

// Root is the root resolver for queries and mutations.
type Root struct {
	db *db.DB
}

func New(db *db.DB) *Root {
	return &Root{db: db}
}

// Viewer gets the user who is accessing the API.
func (r *Root) Viewer(ctx context.Context) *User {
	u := auth.GetUser(ctx)
	trace.AddField(ctx, "authenticated", u.Authenticated())

	if !u.Authenticated() {
		return nil
	}

	return &User{db: r.db, user: u}
}

func (r *Root) Node(ctx context.Context, args struct{ ID graphql.ID }) (*Node, error) {
	kind := relay.UnmarshalKind(args.ID)

	var n nodeResolver
	var err error
	switch kind {
	case TweetNode:
		n, err = r.Tweet(ctx, args)
	default:
		err = fmt.Errorf("unrecognized ID kind %q", kind)
	}

	if err != nil {
		return nil, err
	}
	return &Node{n}, nil
}

func (r *Root) Tweet(ctx context.Context, args struct{ ID graphql.ID }) (*Tweet, error) {
	var id int
	if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
		return nil, err
	}

	l := loaders.Get(ctx)
	thunk := l.Tweets.Load(ctx, loader.IntKey(id))
	t, err := thunk()
	if err != nil {
		return nil, err
	}

	return &Tweet{
		tweet: t.(*tweet.Tweet),
	}, nil
}

type cancelTweetInput struct {
	ID graphql.ID
}

type CancelTweetPayload struct {
	Tweet *Tweet
}

func (r *Root) CancelTweet(ctx context.Context, args struct {
	Input cancelTweetInput
}) (*CancelTweetPayload, error) {
	var id int
	if err := relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return nil, err
	}

	t, err := tweet.Cancel(ctx, r.db, id)
	if err != nil {
		return nil, err
	}

	return &CancelTweetPayload{
		Tweet: &Tweet{tweet: t},
	}, nil
}
