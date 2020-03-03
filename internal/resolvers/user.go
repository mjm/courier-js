package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/tweets"
)

type User struct {
	q    Queries
	user auth.User
}

func (u *User) Name() string {
	return u.user.Name()
}

func (u *User) Nickname() string {
	return u.user.Nickname()
}

func (u *User) Picture() string {
	return u.user.Picture()
}

func (u *User) Customer(ctx context.Context) (*Customer, error) {
	customerID := u.user.CustomerID()
	if customerID == "" {
		return nil, nil
	}

	cus, err := u.q.Customers.Get(ctx, customerID)
	if err != nil {
		return nil, err
	}

	return &Customer{customer: cus}, nil
}

func (u *User) Subscription(ctx context.Context) (*Subscription, error) {
	subID := u.user.SubscriptionID()
	if subID == "" {
		return nil, nil
	}

	sub, err := u.q.Subscriptions.Get(ctx, subID)
	if err != nil {
		return nil, err
	}

	return &Subscription{sub: sub}, nil
}

func (u *User) SubscriptionStatusOverride() *string {
	status := u.user.SubscriptionStatusOverride()
	if status == "" {
		return nil
	}

	status = strings.ToUpper(status)
	return &status
}

func (u *User) MicropubSites() []string {
	return u.user.MicropubSites()
}

func (u *User) AllTweets(ctx context.Context, args struct {
	pager.Options
	Filter *tweets.Filter
}) (*TweetConnection, error) {
	userID, err := u.user.ID()
	if err != nil {
		return nil, err
	}

	var filter tweets.Filter
	if args.Filter != nil {
		filter = *args.Filter
	}

	conn, err := u.q.Tweets.Paged(ctx, userID, filter, args.Options)
	if err != nil {
		return nil, err
	}

	return &TweetConnection{q: u.q, conn: conn}, nil
}
