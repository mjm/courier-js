package main

import (
	"context"
	"flag"
	"fmt"

	"github.com/honeycombio/libhoney-go"
	"github.com/honeycombio/libhoney-go/transmission"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/shared/feeds"
)

var (
	eventType = flag.String("type", "", "Name of the event type to publish")
	userID    = flag.String("user-id", "", "")
	feedID    = flag.String("feed-id", "", "")
)

func main() {
	flag.Parse()

	if err := libhoney.Init(libhoney.Config{
		Transmission: &transmission.WriterSender{},
	}); err != nil {
		panic(err)
	}

	ctx := context.Background()
	l := config.NewLoader(config.DefaultEnv{}, nil)

	var gcpConfig secret.GCPConfig
	if err := l.Load(ctx, &gcpConfig); err != nil {
		panic(err)
	}

	var cfg event.PublisherConfig
	if err := l.Load(ctx, &cfg); err != nil {
		panic(err)
	}

	client, err := event.NewPubSubClient(gcpConfig)
	if err != nil {
		panic(err)
	}
	publisher := event.NewPublisher(cfg, client)

	evt, err := createEvent()
	if err != nil {
		panic(err)
	}

	publisher.Fire(ctx, evt)
}

func createEvent() (interface{}, error) {
	switch *eventType {
	case "":
		return nil, fmt.Errorf("parameter -type is required")

	case "FeedRefreshed":
		return feeds.FeedRefreshed{
			UserId: *userID,
			FeedId: *feedID,
		}, nil
	}

	return nil, fmt.Errorf("unsupported event type %q", *eventType)
}
