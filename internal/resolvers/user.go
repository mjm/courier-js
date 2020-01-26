package resolvers

import (
	"context"
)

type User struct {
}

func (*User) Name(ctx context.Context) string {
	return "Matt Moriarity"
}

func (*User) Nickname() string {
	return "mjm"
}
