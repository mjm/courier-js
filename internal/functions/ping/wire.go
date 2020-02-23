// +build wireinject

package ping

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		secret.GCPSet,
		event.PublishingSet,
		write.NewCommandBus,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		feeds.DefaultSet,
		feeds2.NewFeedQueries,
	))
}
