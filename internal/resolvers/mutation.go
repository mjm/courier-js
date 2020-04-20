package resolvers

import (
	"context"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/relay"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/pkg/indieauth"
)

// AddFeed subscribes the user to a new feed, creating the feed if needed.
func (r *Root) AddFeed(ctx context.Context, args struct {
	Input struct{ URL string }
}) (
	payload struct {
		Feed     *SubscribedFeed
		FeedEdge *SubscribedFeedEdge
	},
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	cmd := feeds.SubscribeCommand{
		UserID: userID,
		URL:    args.Input.URL,
	}
	v, err := r.commandBus.Run(ctx, cmd)
	if err != nil {
		return
	}
	subID := v.(feeds.SubscriptionID)

	// load the edge so that Relay can update its store
	edge, err := r.q.FeedSubscriptions.GetEdge(ctx, subID)
	if err != nil {
		return
	}

	payload.Feed = NewSubscribedFeed(r.q, &edge.Subscription)
	payload.FeedEdge = &SubscribedFeedEdge{q: r.q, edge: edge}
	return
}

func (r *Root) RefreshFeed(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (
	payload struct{ Feed *Feed },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var id feeds.FeedID
	if err = relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return
	}

	cmd := feeds.QueueRefreshCommand{
		UserID: userID,
		FeedID: model.FeedID(id),
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	f, err := r.q.Feeds.Get(ctx, id)
	if err != nil {
		return
	}

	payload.Feed = NewFeed(r.q, f)
	return
}

func (r *Root) SetFeedOptions(ctx context.Context, args struct {
	Input struct {
		ID       graphql.ID
		Autopost *bool
	}
}) (
	payload struct{ Feed *SubscribedFeed },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var id feeds.SubscriptionID
	if err = relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return
	}

	cmd := feeds.UpdateOptionsCommand{
		UserID:         userID,
		SubscriptionID: id,
		Autopost:       *args.Input.Autopost,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	sub, err := r.q.FeedSubscriptions.Get(ctx, id)
	if err != nil {
		return
	}

	payload.Feed = NewSubscribedFeed(r.q, sub)
	return
}

func (r *Root) DeleteFeed(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (
	payload struct{ ID graphql.ID },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var id feeds.SubscriptionID
	if err = relay.UnmarshalSpec(args.Input.ID, &id); err != nil {
		return
	}

	cmd := feeds.UnsubscribeCommand{
		UserID:         userID,
		SubscriptionID: id,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	payload.ID = args.Input.ID
	return
}

// CancelTweet marks a tweet as not to be posted.
func (r *Root) CancelTweet(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (
	payload struct{ Tweet *Tweet },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var postID model.PostID
	if err = relay.UnmarshalSpec(args.Input.ID, &postID); err != nil {
		return
	}

	id := model.TweetGroupID{
		UserID: userID,
		PostID: postID,
	}

	cmd := tweets.CancelCommand{
		TweetGroupID: id,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	_, err = r.q.TweetsDynamo.Get(ctx, id)
	if err != nil {
		return
	}

	// TODO put back
	// payload.Tweet = NewTweet(r.q, t)
	return
}

func (r *Root) UncancelTweet(ctx context.Context, args struct {
	Input struct{ ID graphql.ID }
}) (
	payload struct{ Tweet *Tweet },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var postID model.PostID
	if err = relay.UnmarshalSpec(args.Input.ID, &postID); err != nil {
		return
	}

	id := model.TweetGroupID{
		UserID: userID,
		PostID: postID,
	}

	cmd := tweets.UncancelCommand{
		TweetGroupID: id,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	_, err = r.q.TweetsDynamo.Get(ctx, id)
	if err != nil {
		return
	}

	// TODO put this back
	// payload.Tweet = NewTweet(r.q, t)
	return
}

func (r *Root) EditTweet(ctx context.Context, args struct {
	Input struct {
		ID        graphql.ID
		Body      string
		MediaURLs *[]string
	}
}) (
	payload struct{ Tweet *Tweet },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var postID model.PostID
	if err = relay.UnmarshalSpec(args.Input.ID, &postID); err != nil {
		return
	}

	id := model.TweetGroupID{
		UserID: userID,
		PostID: postID,
	}

	// TODO change GraphQL API to send all the tweets here

	// cmd := tweets.UpdateCommand{
	// 	TweetGroupID: id,
	// 	Body:         args.Input.Body,
	// }
	// if args.Input.MediaURLs != nil {
	// 	cmd.MediaURLs = *args.Input.MediaURLs
	// }
	// if _, err = r.commandBus.Run(ctx, cmd); err != nil {
	// 	return
	// }

	_, err = r.q.TweetsDynamo.Get(ctx, id)
	if err != nil {
		return
	}

	// TODO put this back
	// payload.Tweet = NewTweet(r.q, t)
	return
}

func (r *Root) PostTweet(ctx context.Context, args struct {
	Input struct {
		ID        graphql.ID
		Body      *string
		MediaURLs *[]string
	}
}) (
	payload struct{ Tweet *Tweet },
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	var postID model.PostID
	if err = relay.UnmarshalSpec(args.Input.ID, &postID); err != nil {
		return
	}

	id := model.TweetGroupID{
		UserID: userID,
		PostID: postID,
	}

	cmd := tweets.EnqueuePostCommand{
		TweetGroupID: id,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	_, err = r.q.TweetsDynamo.Get(ctx, id)
	if err != nil {
		return
	}

	// TODO put this back
	// payload.Tweet = NewTweet(r.q, t)
	return
}

func (r *Root) Subscribe(ctx context.Context, args struct {
	Input struct {
		TokenID *string
		Email   *string
	}
}) (
	payload struct {
		User *User
	},
	err error,
) {
	user := auth.GetUser(ctx)
	userID, err := user.ID()
	if err != nil {
		return
	}

	var email, tokenID string
	if args.Input.TokenID != nil {
		tokenID = *args.Input.TokenID
	}
	if args.Input.Email != nil {
		email = *args.Input.Email
	}

	cmd := billing.SubscribeCommand{
		UserID:  userID,
		TokenID: tokenID,
		Email:   email,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	payload.User = &User{q: r.q, user: user}
	return
}

func (r *Root) CancelSubscription(ctx context.Context, args struct {
	Input struct {
		Placeholder *string
	}
}) (
	payload struct {
		User *User
	},
	err error,
) {
	user := auth.GetUser(ctx)
	userID, err := user.ID()
	if err != nil {
		return
	}

	cmd := billing.CancelCommand{
		UserID: userID,
	}
	if _, err = r.commandBus.Run(ctx, cmd); err != nil {
		return
	}

	payload.User = &User{q: r.q, user: user}
	return
}

func (r *Root) CompleteIndieAuth(ctx context.Context, args struct {
	Input struct {
		Code  string
		State string
		Data  string
	}
}) (
	payload struct {
		Origin string
	},
	err error,
) {
	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return
	}

	result, err := indieauth.Complete(ctx, args.Input.Code, args.Input.State, args.Input.Data)
	if err != nil {
		return
	}

	if _, err = r.commandBus.Run(ctx, tweets.SetupSyndicationCommand{
		UserID: userID,
		URL:    result.URL,
		Token:  result.Token,
	}); err != nil {
		return
	}

	payload.Origin = result.Origin
	return
}
