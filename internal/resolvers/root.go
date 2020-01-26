package resolvers

import (
	"context"

	"github.com/mjm/courier-js/internal/trace"
)

// Root is the root resolver for queries and mutations.
type Root struct {
}

func (*Root) CurrentUser(ctx context.Context) *User {
	trace.AddField(ctx, "fetching", "user")
	return &User{}
}
