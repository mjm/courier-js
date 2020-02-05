package resolvers

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/write/feeds"
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
	subID := v.(int)

	// load the edge so that Relay can update its store
	edge, err := feed.GetSubscriptionEdge(ctx, r.db, subID)
	if err != nil {
		return nil, err
	}

	return &AddFeedPayload{
		Feed:     &SubscribedFeed{sub: edge.Node.(*feed.Subscription)},
		FeedEdge: &SubscribedFeedEdge{edge: edge},
	}, nil
}

type CancelTweetPayload struct {
	Tweet *Tweet
}

// CancelTweet marks a tweet as not to be posted.
func (r *Root) CancelTweet(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (*CancelTweetPayload, error) {
	var id int
	if err := relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return nil, err
	}

	t, err := r.tweetService.Cancel(ctx, id)
	if err != nil {
		return nil, err
	}

	return &CancelTweetPayload{
		Tweet: &Tweet{tweet: t},
	}, nil
}
