package main

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/honeycombio/libhoney-go"
	"github.com/honeycombio/libhoney-go/transmission"

	"github.com/mjm/courier-js/internal/event"
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

	var cfg event.PublisherConfig
	cfg.ProjectID = os.Getenv("GCP_PROJECT")
	cfg.CredentialsFile = os.Getenv("GCP_CREDENTIALS_FILE")
	cfg.TopicID = os.Getenv("GCP_TOPIC_ID")

	bus := event.NewBus()
	if _, err := event.NewPublisher(cfg, bus); err != nil {
		panic(err)
	}

	evt, err := createEvent()
	if err != nil {
		panic(err)
	}

	bus.Fire(ctx, evt)
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
