// +build wireinject

package ping

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		config.DefaultSet,
		secret.GCPSet,
		tasks.DefaultSet,
		trace.NewConfig,
		db.DefaultSet,
		feeds2.NewFeedQueries,
	))
}
