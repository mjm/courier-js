//+build wireinject

package events

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/shared"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		NewPusher,
		config.DefaultSet,
		secret.GCPSet,
		notifications.NewNotifier,
		event.PusherSet,
		event.SourceSet,
		event.PublishingSet,
		write.NewCommandBus,
		db.DefaultSet,
		auth.DefaultSet,
		billing.DefaultSet,
		tasks.DefaultSet,
		shared.DefaultSet,
		tweets2.EventHandlerSet,
		user.NewEventRecorder,
		user2.EventHandlerSet,
	))
}
