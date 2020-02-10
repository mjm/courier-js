package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
)

type AddFeedPayload struct {
	Feed     *SubscribedFeed
	FeedEdge *SubscribedFeedEdge
}

// AddFeed subscribes the user to a new feed, creating the feed if needed.
func (r *Root) AddFeed(ctx context.Context, args struct {
	Input struct{ URL string }
}) (*AddFeedPayload, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	cmd := feeds.SubscribeCommand{
		UserID: userID,
		URL:    args.Input.URL,
	}
	v, err := r.commandBus.Run(ctx, cmd)
	if err != nil {
		return nil, err
	}
	subID := v.(feeds.SubscriptionID)

	// load the edge so that Relay can update its store
	edge, err := r.q.FeedSubscriptions.GetEdge(ctx, subID)
	if err != nil {
		return nil, err
	}

	return &AddFeedPayload{
		Feed:     NewSubscribedFeed(r.q, &edge.Subscription),
		FeedEdge: &SubscribedFeedEdge{q: r.q, edge: edge},
	}, nil
}

type RefreshFeedPayload struct {
	Feed *Feed
}

func (r *Root) RefreshFeed(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (*RefreshFeedPayload, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	var id feeds.FeedID
	if err := relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return nil, err
	}

	cmd := feeds.RefreshCommand{
		UserID: userID,
		FeedID: id,
		Force:  false,
	}
	if _, err := r.commandBus.Run(ctx, cmd); err != nil {
		return nil, err
	}

	f, err := r.q.Feeds.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return &RefreshFeedPayload{
		Feed: &Feed{feed: f},
	}, nil
}

type DeleteFeedPayload struct {
	ID graphql.ID
}

func (r *Root) DeleteFeed(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (*DeleteFeedPayload, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	var id feeds.SubscriptionID
	if err := relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return nil, err
	}

	cmd := feeds.UnsubscribeCommand{
		UserID:         userID,
		SubscriptionID: id,
	}
	if _, err := r.commandBus.Run(ctx, cmd); err != nil {
		return nil, err
	}

	return &DeleteFeedPayload{ID: args.Input.ID}, nil
}

type CancelTweetPayload struct {
	Tweet *Tweet
}

// CancelTweet marks a tweet as not to be posted.
func (r *Root) CancelTweet(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (*CancelTweetPayload, error) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return nil, err
	}

	var id tweets.TweetID
	if err := relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return nil, err
	}

	cmd := tweets.CancelCommand{
		UserID:  userID,
		TweetID: id,
	}
	if _, err := r.commandBus.Run(ctx, cmd); err != nil {
		return nil, err
	}

	t, err := r.q.Tweets.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	return &CancelTweetPayload{
		Tweet: NewTweet(r.q, t),
	}, nil
}
