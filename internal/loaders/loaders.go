package loaders

import (
	"context"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/models/tweet"
)

// AllLoaders is a Wire provider set that can create a Loaders with all the necessary loaders.
var AllLoaders = wire.NewSet(
	tweet.NewLoader,
	wire.Struct(new(Loaders), "Tweets"))

// Loaders contains all of the different data loaders for the app.
//
// Because loaders cache results, they should be recreated for each request.
type Loaders struct {
	Tweets tweet.Loader
}

type loadersKey struct{}

// WithLoaders creates a new context that has a new set of loaders using the given database.
func WithLoaders(ctx context.Context, db *db.DB) context.Context {
	l := CreateLoaders(db)
	return context.WithValue(ctx, loadersKey{}, &l)
}

// Get retrieves the loaders from the current context.
func Get(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey{}).(*Loaders)
}
