// +build wireinject

package ping

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		secret.GCPSet,
		event.PublishingSet,
		tasks.DefaultSet,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		feeds2.NewFeedQueries,
	))
}
