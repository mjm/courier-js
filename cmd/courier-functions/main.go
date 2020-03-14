package main

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"cloud.google.com/go/pubsub"
	"google.golang.org/api/option"

	"github.com/mjm/courier-js/internal/functions/events"
	"github.com/mjm/courier-js/internal/trace"
)

var port string

func main() {
	var svcname string
	if len(os.Args) < 2 {
		handleAllFunctions()
	} else {
		svcname = os.Args[1]
		switch os.Args[1] {
		case "graphql":
			handleSingleFunction(graphQLHandler)
		case "events":
			handleSingleFunction(eventsHandler)
		case "ping":
			handleSingleFunction(pingHandler)
		case "pusher-auth":
			handleSingleFunction(pusherAuthHandler)
		case "stripe-callback":
			handleSingleFunction(stripeCallbackHandler)
		case "tasks":
			handleSingleFunction(tasksHandler)
		}
	}

	trace.Init(secretConfig, svcname)

	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleSingleFunction(handler http.Handler) {
	http.Handle("/", handler)
}

func handleAllFunctions() {
	http.Handle("/graphql", graphQLHandler)
	http.Handle("/ping", pingHandler)
	http.Handle("/pusher-auth", pusherAuthHandler)
	http.Handle("/stripe-callback", stripeCallbackHandler)
	http.Handle("/events", eventsHandler)
	http.Handle("/tasks", tasksHandler)

	go pollForEvents()
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

		sentMsg := events.PubSubPayload{
			Message: events.Message{
				Data:       msg.Data,
				Attributes: msg.Attributes,
				ID:         msg.ID,
			},
			Subscription: sub.ID(),
		}
		payload, err := json.Marshal(sentMsg)
		if err != nil {
			msg.Nack()
			log.Fatal(err)
		}

		r, err := http.NewRequestWithContext(ctx, "POST", "http://localhost:"+port+"/events", bytes.NewBuffer(payload))
		if err != nil {
			msg.Nack()
			log.Fatal(err)
		}

		res, err := http.DefaultClient.Do(r)
		if err != nil {
			msg.Nack()
			log.Fatal(err)
		}

		if res.StatusCode > 299 {
			msg.Nack()
			log.Fatalf("unexpected status code %d handling event", res.StatusCode)
		}

		msg.Ack()
	})
	if err != nil {
		log.Printf("error receiving pubsub messages: %v", err)
	}
}
