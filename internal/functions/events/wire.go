//+build wireinject

package events

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		NewPusher,
		config.DefaultSet,
		secret.GCPSet,
		notifications.NewNotifier,
		event.PusherSet,
		event.NewBus,
		trace.NewConfig,
		db.DefaultSet,
		tweets.NewTweetQueries,
		user.NewEventRecorder,
	))
}
