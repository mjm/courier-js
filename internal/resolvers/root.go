package resolvers

import (
	"context"
	"fmt"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

// Root is the root resolver for queries and mutations.
type Root struct {
	db db.DB

	q          Queries
	commandBus *write.CommandBus
}

// New creates a new root resolver.
func New(
	q Queries,
	commandBus *write.CommandBus,
	_ *feeds.CommandHandler,
	_ *tweets.CommandHandler,
	_ *billing.CommandHandler,
	_ *user.CommandHandler,
) *Root {
	return &Root{
		q:          q,
		commandBus: commandBus,
	}
}

// Viewer gets the user who is accessing the API.
func (r *Root) Viewer(ctx context.Context) *User {
	u := auth.GetUser(ctx)
	trace.AddField(ctx, "authenticated", u.Authenticated())

	if !u.Authenticated() {
		return nil
	}

	return &User{q: r.q, user: u}
}

// Node fetches any kind of node in the app by ID.
func (r *Root) Node(ctx context.Context, args struct{ ID graphql.ID }) (*Node, error) {
	kind := relay.UnmarshalKind(args.ID)

	var n nodeResolver
	var err error
	switch kind {
	case FeedNode:
		var id feeds.FeedID
		if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
			return nil, err
		}

		f, err := r.q.Feeds.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		n = NewFeed(r.q, f)

	case SubscribedFeedNode:
		n, err = r.SubscribedFeed(ctx, args)
	case TweetNode:
		n, err = r.Tweet(ctx, args)
	case PostNode:
		var id feeds.PostID
		if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
			return nil, err
		}

		p, err := r.q.Posts.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		n = NewPost(r.q, p)
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
	var id feeds.SubscriptionID
	if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
		return nil, err
	}

	sub, err := r.q.FeedSubscriptions.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return NewSubscribedFeed(r.q, sub), nil
}

// Tweet gets a tweet for the current user by ID.
func (r *Root) Tweet(ctx context.Context, args struct{ ID graphql.ID }) (*Tweet, error) {
	var id tweets.TweetID
	if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
		return nil, err
	}

	t, err := r.q.Tweets.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return NewTweet(r.q, t), nil
}

// AllSubscribedFeeds gets a paged list of feed subscriptions for the current user.
func (r *Root) AllSubscribedFeeds(ctx context.Context, args pager.Options) (*SubscribedFeedConnection, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	conn, err := r.q.FeedSubscriptions.Paged(ctx, userID, args)
	if err != nil {
		return nil, err
	}

	return &SubscribedFeedConnection{q: r.q, conn: conn}, nil
}

// AllEvents gets a paged list of events for the current user.
func (r *Root) AllEvents(ctx context.Context, args pager.Options) (*EventConnection, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	conn, err := r.q.Events.Paged(ctx, userID, args)
	if err != nil {
		return nil, err
	}

	return &EventConnection{q: r.q, conn: conn}, nil
}

func (r *Root) Microformats(ctx context.Context, args struct {
	URL string
}) (*MicroformatPage, error) {
	return nil, nil
}

func (r *Root) FeedPreview(ctx context.Context, args struct {
	URL string
}) (*FeedPreview, error) {
	return nil, nil
}
