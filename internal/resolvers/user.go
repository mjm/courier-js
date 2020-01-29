package resolvers

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/tweet"
	"github.com/mjm/courier-js/internal/pager"
	"github.com/stripe/stripe-go"
)

type User struct {
	db   *db.DB
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

	l := loaders.Get(ctx)
	thunk := l.Customers.Load(ctx, dataloader.StringKey(customerID))
	cus, err := thunk()
	if err != nil {
		return nil, err
	}

	return &Customer{customer: cus.(*stripe.Customer)}, nil
}

func (u *User) Subscription(ctx context.Context) (*Subscription, error) {
	subID := u.user.SubscriptionID()
	if subID == "" {
		return nil, nil
	}

	l := loaders.Get(ctx)
	thunk := l.Subscriptions.Load(ctx, dataloader.StringKey(subID))
	sub, err := thunk()
	if err != nil {
		return nil, err
	}

	return &Subscription{sub: sub.(*stripe.Subscription)}, nil
}

func (u *User) AllTweets(ctx context.Context, args struct {
	Filter *tweet.Filter
	First  *int32
	After  *pager.Cursor
	Last   *int32
	Before *pager.Cursor
}) (*TweetConnection, error) {
	userID, err := u.user.MustID()
	if err != nil {
		return nil, err
	}

	p := &tweet.Pager{
		UserID: userID,
	}
	if args.Filter != nil {
		p.Filter = *args.Filter
	}
	conn, err := pager.Paged(ctx, u.db, p, pager.Options{
		First:  args.First,
		After:  args.After,
		Last:   args.Last,
		Before: args.Before,
	})
	if err != nil {
		return nil, err
	}

	return &TweetConnection{conn: conn}, nil
}
