//+build wireinject

package stripecb

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		event.PublishingSet,
		secret.GCPSet,
		trace.NewConfigFromSecrets,
		auth.NewConfigFromSecrets,
		auth.NewManagementClient,
		billing.NewSubscriptionQueries,
		billing2.NewClient,
		billing2.NewConfigFromSecrets,
	))
}
