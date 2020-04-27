//+build wireinject

package graphql

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/billing"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

func InitializeHandler(
	schemaString SchemaString,
	gcpConfig secret.GCPConfig,
) (*Handler, error) {
	panic(
		wire.Build(
			NewHandler,
			NewSchema,
			config.DefaultSet,
			secret.GCPSet,
			resolvers.DefaultSet,
			auth.DefaultSet,
			db.DefaultSet,
			billing2.DefaultSet,
			write.NewCommandBus,
			tasks.DefaultSet,
			event.AWSPublishingSet,
			shared.DefaultSet,
			feeds.DefaultSet,
			tweets.DefaultSet,
			billing.DefaultSet,
			user.DefaultSet,
		),
	)
}
func InitializeLambda() (*Handler, error) {
	panic(
		wire.Build(
			wire.Value(SchemaFile("schema.graphql")),
			NewHandler,
			NewSchema,
			LoadSchemaFromFile,
			config.DefaultSet,
			secret.AWSSet,
			resolvers.DefaultSet,
			auth.DefaultSet,
			db.DefaultSet,
			billing2.DefaultSet,
			write.NewCommandBus,
			tasks.DefaultSet,
			event.AWSPublishingSet,
			shared.DefaultSet,
			feeds.DefaultSet,
			tweets.DefaultSet,
			billing.DefaultSet,
			user.DefaultSet,
		),
	)
}
