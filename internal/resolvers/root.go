package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/trace"
)

// Root is the root resolver for queries and mutations.
type Root struct {
}

func New() *Root {
	return &Root{}
}

// Viewer gets the user who is accessing the API.
func (*Root) Viewer(ctx context.Context) *User {
	u := auth.GetUser(ctx)
	trace.AddField(ctx, "authenticated", u.Authenticated())

	if !u.Authenticated() {
		return nil
	}

	return &User{user: u}
}

func (r *Root) Tweet(ctx context.Context, args struct {
	ID graphql.ID `json:"id"`
}) (*Tweet, error) {
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
