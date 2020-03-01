package main

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/pubsub"
	"github.com/GoogleCloudPlatform/functions-framework-go/funcframework"
	"google.golang.org/api/option"

	"github.com/mjm/courier-js"
)

func main() {
	funcframework.RegisterHTTPFunction("/graphql", courier.GraphQL)
	funcframework.RegisterHTTPFunction("/indieauth-callback", courier.IndieAuthCallback)
	funcframework.RegisterHTTPFunction("/stripe-callback", courier.StripeCallback)
	funcframework.RegisterHTTPFunction("/pusher-auth", courier.PusherAuth)
	funcframework.RegisterHTTPFunction("/ping", courier.Ping)
	funcframework.RegisterHTTPFunction("/tasks", courier.Tasks)
	// funcframework.RegisterEventFunction("/events", courier.Events)

	go pollForEvents()

	// Use PORT environment variable, or default to 8080.
	port := "8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	if err := funcframework.Start(port); err != nil {
		log.Fatalf("funcframework.Start: %v\n", err)
	}
}

func pollForEvents() {
	ctx := context.Background()
	client, err := pubsub.NewClient(ctx,
		os.Getenv("GOOGLE_PROJECT"),
		option.WithCredentialsFile(os.Getenv("GCP_CREDENTIALS_FILE")))
	if err != nil {
		log.Printf("error creating pubsub client: %v", err)
	}

	sub := client.Subscription(os.Getenv("GCP_SUBSCRIPTION_ID"))
	err = sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
		log.Printf("got pubsub message")
		// if err := courier.Events(ctx, events.PubSubEvent{Data: msg.Data}); err != nil {
		// 	log.Printf("error processing pubsub message: %v", err)
		// 	msg.Nack()
		// 	return
		// }

		msg.Ack()
	})
	if err != nil {
		log.Printf("error receiving pubsub messages: %v", err)
	}
}
