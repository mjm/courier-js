// +build wireinject

package pusherauth

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		config.DefaultSet,
		secret.GCPSet,
		auth.DefaultSet,
		event.PusherSet,
	))
}

func InitializeLambda() (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		config.DefaultSet,
		secret.AWSSet,
		auth.DefaultSet,
		event.PusherSet,
	))
}
