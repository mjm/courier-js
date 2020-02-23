//+build wireinject

package events

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*PubSubHandler, error) {
	panic(wire.Build(
		NewPubSubHandler,
		NewPusher,
		notifications.NewNotifier,
		event.NewPusherClient,
		event.NewBeamsClient,
		event.NewBus,
		secret.GCPSet,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		tweets.NewTweetQueries,
		user.NewEventRecorder,
	))
}
