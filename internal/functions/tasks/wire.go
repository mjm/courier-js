//+build wireinject

package tasks

import (
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
)

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	panic(wire.Build(
		NewHandler,
		config.DefaultSet,
		secret.GCPSet,
		tasks.DefaultSet,
		event.PublishingSet,
		write.NewCommandBus,
		trace.NewConfigFromSecrets,
		db.NewConfigFromSecrets,
		db.New,
		tweets.DefaultSet,
		tweets.NewTwitterConfigFromSecrets,
		feeds.DefaultSet,
		auth.DefaultSet,
		billing.DefaultSet,
	))
}
