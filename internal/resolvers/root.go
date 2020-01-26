package resolvers

import (
	"context"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/trace"
)

// Root is the root resolver for queries and mutations.
type Root struct {
}

// CurrentUser gets the user who is accessing the API.
func (*Root) CurrentUser(ctx context.Context) *User {
	u := auth.GetUser(ctx)
	trace.AddField(ctx, "authenticated", u.Authenticated())

	if !u.Authenticated() {
		return nil
	}

	return &User{user: u}
}
