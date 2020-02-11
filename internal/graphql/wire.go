//+build wireinject

package graphql

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

func InitializeHandler(
	schemaString string,
	authConfig auth.Config,
	dbConfig db.Config,
	stripeConfig billing2.Config,
) (*Handler, error) {
	panic(
		wire.Build(
			NewHandler,
			NewSchema,
			resolvers.New,
			resolvers.QueriesProvider,
			auth.NewAuthenticator,
			db.New,
			billing2.NewClient,
			write.NewCommandBus,
			event.NewBus,
			feeds.DefaultSet,
			tweets.DefaultSet,
			billing.DefaultSet,
			user.NewEventRecorder,
		),
	)
}
