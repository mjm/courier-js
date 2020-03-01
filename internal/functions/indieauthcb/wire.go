//+build wireinject

package indieauthcb

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/tweets"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		event.PublishingSet,
		write.NewCommandBus,
		tasks.DefaultSet,
		secret.GCPSet,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		auth.DefaultSet,
		auth.NewConfigFromSecrets,
		billing.NewClient,
		billing.NewConfigFromSecrets,
		tweets.NewTwitterConfigFromSecrets,
		tweets.DefaultSet,
	))
}
