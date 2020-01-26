package resolvers

import (
	"context"

	"github.com/mjm/courier-js/internal/auth"
)

type User struct {
	user auth.User
}

func (*User) Name(ctx context.Context) string {
	return "Matt Moriarity"
}

func (*User) Nickname() string {
	return "mjm"
}
