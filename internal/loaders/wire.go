//+build wireinject

package loaders

import (
	"github.com/google/wire"
	"github.com/mjm/courier-js/internal/db"
)

// CreateLoaders creates all of the loaders for the application.
func CreateLoaders(db *db.DB) Loaders {
	panic(wire.Build(AllLoaders))
}
