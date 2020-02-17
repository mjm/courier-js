//+build wireinject

package postqueued

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/tweets"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		event.PublishingSet,
		write.NewCommandBus,
		secret.GCPSet,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		auth.NewConfigFromSecrets,
		auth.NewManagementClient,
		tweets.NewTwitterConfigFromSecrets,
		tweets.DefaultSet,
	))
}
