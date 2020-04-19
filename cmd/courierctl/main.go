package main

import (
	"context"
	"log"
	"os"

	"github.com/honeycombio/libhoney-go"
	"github.com/urfave/cli/v2"
	"go.opentelemetry.io/otel/api/global"

	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	tweets2 "github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
)

var commandBus *write.CommandBus
var feedQueries *feeds2.FeedQueriesDynamo
var tweetQueries *tweets2.TweetQueriesDynamo

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

func newApp(bus *write.CommandBus, feedQ *feeds2.FeedQueriesDynamo, tweetQ *tweets2.TweetQueriesDynamo, _ *feeds.CommandHandler, _ *tweets.CommandHandler, _ *tweets.EventHandler) *cli.App {
	commandBus = bus
	feedQueries = feedQ
	tweetQueries = tweetQ

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
			tweetCommand,
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
