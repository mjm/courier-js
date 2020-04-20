package resolvers

import (
	"context"
	"errors"
	"net/url"

	"github.com/google/wire"
	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/net/context/ctxhttp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"willnorris.com/go/microformats"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
	feeds2 "github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

var DefaultSet = wire.NewSet(New, QueriesProvider)

var (
	ErrUnknownKind = errors.New("unrecognized ID kind")
)

// Root is the root resolver for queries and mutations.
type Root struct {
	db db.DB

	q          Queries
	commandBus *write.CommandBus
	tasks      *tasks.Tasks
}

// New creates a new root resolver.
func New(
	q Queries,
	commandBus *write.CommandBus,
	tasks *tasks.Tasks,
	_ *feeds.CommandHandler,
	_ *tweets.CommandHandler,
	_ *billing.CommandHandler,
	_ *user.CommandHandler,
) *Root {
	return &Root{
		q:          q,
		commandBus: commandBus,
		tasks:      tasks,
	}
}

// Viewer gets the user who is accessing the API.
func (r *Root) Viewer(ctx context.Context) *User {
	u := auth.GetUser(ctx)
	trace.SpanFromContext(ctx).SetAttributes(key.Bool("authenticated", u.Authenticated()))

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
		var id feeds2.PostID
		if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
			return nil, err
		}

		p, err := r.q.Posts.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		n = NewPost(r.q, p)
	default:
		err = status.Errorf(codes.InvalidArgument, "unrecognized ID kind %q", kind)
	}

	if err != nil {
		return nil, err
	}
	return &Node{n}, nil
}

// SubscribedFeed gets a feed subscription for the current user by ID.
func (r *Root) SubscribedFeed(ctx context.Context, args struct{ ID graphql.ID }) (*SubscribedFeedDynamo, error) {
	var id model.FeedID
	if err := relay.UnmarshalSpec(args.ID, &id); err != nil {
		return nil, err
	}

	f, err := r.q.FeedsDynamo.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return NewSubscribedFeedDynamo(r.q, f), nil
}

// Tweet gets a tweet for the current user by ID.
func (r *Root) Tweet(ctx context.Context, args struct{ ID graphql.ID }) (*TweetDynamo, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	var postID model.PostID
	if err := relay.UnmarshalSpec(args.ID, &postID); err != nil {
		return nil, err
	}

	id := model.TweetGroupID{
		UserID: userID,
		PostID: postID,
	}

	tg, err := r.q.TweetsDynamo.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return NewTweetDynamo(r.q, tg), nil
}

// AllSubscribedFeeds gets a paged list of feed subscriptions for the current user.
func (r *Root) AllSubscribedFeeds(ctx context.Context, args pager.Options) (*SubscribedFeedConnection, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	conn, err := r.q.FeedsDynamo.Paged(ctx, userID, args)
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
	trace.SpanFromContext(ctx).SetAttributes(key.String("url", args.URL))

	u, err := url.Parse(args.URL)
	if err != nil {
		return nil, err
	}

	res, err := ctxhttp.Get(ctx, nil, u.String())
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	data := microformats.Parse(res.Body, u)
	return &MicroformatPage{data: data}, nil
}

func (r *Root) FeedPreview(ctx context.Context, args struct {
	URL string
}) (*FeedPreview, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	cmd := feeds.CreateCommand{
		UserID: userID,
		URL:    args.URL,
	}
	v, err := r.commandBus.Run(ctx, cmd)
	if err != nil {
		return nil, err
	}
	feedID := v.(feeds.FeedID)

	feed, err := r.q.Feeds.Get(ctx, feedID)
	if err != nil {
		return nil, err
	}

	return &FeedPreview{q: r.q, feed: feed}, nil
}
