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
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/pager"
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
	case FeedNode:
		var id int
		if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
			return nil, err
		}

		l := loaders.Get(ctx)
		thunk := l.Feeds.Load(ctx, loader.IntKey(id))
		var f interface{}
		f, err = thunk()
		if err == nil {
			n = &Feed{feed: f.(*feed.Feed)}
		}
	case SubscribedFeedNode:
		n, err = r.SubscribedFeed(ctx, args)
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

func (r *Root) SubscribedFeed(ctx context.Context, args struct{ ID graphql.ID }) (*SubscribedFeed, error) {
	var id int
	if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
		return nil, err
	}

	l := loaders.Get(ctx)
	thunk := l.FeedSubscriptions.Load(ctx, loader.IntKey(id))
	sub, err := thunk()
	if err != nil {
		return nil, err
	}

	return &SubscribedFeed{sub: sub.(*feed.Subscription)}, nil
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

func (r *Root) AllSubscribedFeeds(ctx context.Context, args pager.Options) (*SubscribedFeedConnection, error) {
	userID, err := auth.GetUser(ctx).MustID()
	if err != nil {
		return nil, err
	}

	p := &feed.SubscriptionPager{
		UserID: userID,
	}
	conn, err := pager.Paged(ctx, r.db, p, args)
	if err != nil {
		return nil, err
	}

	return &SubscribedFeedConnection{conn: conn}, nil
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
