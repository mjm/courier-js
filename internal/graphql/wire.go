//+build wireinject

package graphql

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

func InitializeHandler(
	schemaString string,
	gcpConfig secret.GCPConfig,
) (*Handler, error) {
	panic(
		wire.Build(
			NewHandler,
			NewSchema,
			secret.GCPSet,
			trace.NewConfigFromSecrets,
			resolvers.New,
			resolvers.QueriesProvider,
			auth.NewConfigFromSecrets,
			auth.DefaultSet,
			db.NewConfigFromSecrets,
			db.New,
			billing2.NewConfigFromSecrets,
			billing2.NewClient,
			write.NewCommandBus,
			event.NewBus,
			feeds.DefaultSet,
			tweets.DefaultSet,
			billing.DefaultSet,
			user.DefaultSet,
			user.NewEventRecorder,
		),
	)
}
