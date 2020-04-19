// +build wireinject

package ping

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		config.DefaultSet,
		secret.GCPSet,
		write.NewCommandBus,
		event.PublishingSet,
		tasks.DefaultSet,
		db.DefaultSet,
		shared.DefaultSet,
		feeds.DefaultSet,
	))
}
