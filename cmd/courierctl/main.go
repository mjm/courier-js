package main

import (
	"context"
	"log"
	"os"

	"github.com/honeycombio/libhoney-go"
	"github.com/urfave/cli/v2"
	"go.opentelemetry.io/otel/api/global"

	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
)

var commandBus *write.CommandBus

var tr = global.Tracer("courierctl")

func main() {
	trace.Init(secretConfig, "courierctl")

	app, err := setupApp(secretConfig)
	if err != nil {
		log.Fatal(err)
	}

	defer libhoney.Flush()

	ctx, span := tr.Start(context.Background(), "courierctl")
	defer span.End()

	if err := app.RunContext(ctx, os.Args); err != nil {
		span.RecordError(ctx, err)
		log.Fatal(err)
	}
}

func newApp(bus *write.CommandBus, _ *feeds.CommandHandler, _ *tweets.CommandHandler, _ *tweets.EventHandler) *cli.App {
	commandBus = bus
	return &cli.App{
		EnableBashCompletion: true,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "user,u",
				Usage: "the ID of the user to act as",
			},
		},
		Commands: []*cli.Command{
			feedCommand,
		},
	}
}

var secretConfig secret.GCPConfig

func init() {
	var err error
	secretConfig, err = secret.GCPConfigFromEnv()
	if err != nil {
		panic(err)
	}
}
