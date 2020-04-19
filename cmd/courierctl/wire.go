// +build wireinject

package main

import (
	"github.com/google/wire"
	"github.com/urfave/cli/v2"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/internal/write/tweets"
)

func setupApp(gcpConfig secret.GCPConfig) (*cli.App, error) {
	panic(
		wire.Build(
			newApp,
			config.DefaultSet,
			secret.GCPSet,
			db.DefaultSet,
			auth.DefaultSet,
			billing.DefaultSet,
			write.NewCommandBus,
			tasks.DefaultSet,
			event.NewBus,
			wire.Bind(new(event.Sink), new(*event.Bus)),
			wire.Bind(new(event.Source), new(*event.Bus)),
			shared.DefaultSet,
			feeds.DefaultSet,
			tweets.DefaultSet,
			tweets.NewEventHandler,
			feeds2.NewFeedQueriesDynamo,
		),
	)
}
