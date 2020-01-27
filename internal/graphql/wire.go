//+build wireinject

package graphql

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/resolvers"
)

func InitializeHandler(schemaString string, authConfig auth.Config, dbConfig db.Config) (*Handler, error) {
	panic(wire.Build(NewHandler, NewSchema, resolvers.New, auth.NewAuthenticator, db.New))
}
