//+build wireinject

package graphql

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/service"
)

func InitializeHandler(schemaString string, authConfig auth.Config, dbConfig db.Config, stripeConfig billing.Config) (*Handler, error) {
	panic(wire.Build(NewHandler, NewSchema, resolvers.New, auth.NewAuthenticator, db.New, billing.NewClient, service.All))
}
