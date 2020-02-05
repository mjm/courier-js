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
	"github.com/mjm/courier-js/internal/models/post"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/service"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
)

// Root is the root resolver for queries and mutations.
type Root struct {
	db db.DB

	commandBus *write.CommandBus

	tweetService *service.TweetService
}

// New creates a new root resolver.
func New(
	db db.DB,
	commandBus *write.CommandBus,
	_ *feeds.CommandHandler,
	tweetService *service.TweetService) *Root {
	return &Root{
		db:           db,
		commandBus:   commandBus,
		tweetService: tweetService,
	}
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

// Node fetches any kind of node in the app by ID.
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
		var f interface{}
		f, err = l.Feeds.Load(ctx, loader.IntKey(id))()
		if err == nil {
			n = &Feed{feed: f.(*feed.Feed)}
		}
	case SubscribedFeedNode:
		n, err = r.SubscribedFeed(ctx, args)
	case TweetNode:
		n, err = r.Tweet(ctx, args)
	case PostNode:
		var id int
		if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
			return nil, err
		}

		l := loaders.Get(ctx)
		var p interface{}
		p, err = l.Posts.Load(ctx, loader.IntKey(id))()
		if err == nil {
			n = &Post{post: p.(*post.Post)}
		}
	default:
		err = fmt.Errorf("unrecognized ID kind %q", kind)
	}

	if err != nil {
		return nil, err
	}
	return &Node{n}, nil
}

// SubscribedFeed gets a feed subscription for the current user by ID.
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

// Tweet gets a tweet for the current user by ID.
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

// AllSubscribedFeeds gets a paged list of feed subscriptions for the current user.
func (r *Root) AllSubscribedFeeds(ctx context.Context, args pager.Options) (*SubscribedFeedConnection, error) {
	userID, err := auth.GetUser(ctx).ID()
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
