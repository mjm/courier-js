// +build wireinject

package pusherauth

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		secret.GCPSet,
		trace.NewConfigFromSecrets,
		auth.DefaultSet,
		auth.NewConfigFromSecrets,
		event.NewPusherClient,
	))
}
