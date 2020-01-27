package resolvers

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/stripe/stripe-go"
)

type User struct {
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
