package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	var handler http.Handler

	switch os.Args[1] {
	case "graphql":
		handler = graphQLHandler
	case "indieauth-callback":
		handler = indieAuthCallbackHandler
	case "ping":
		handler = pingHandler
	case "pusher-auth":
		handler = pusherAuthHandler
	case "stripe-callback":
		handler = stripeCallbackHandler
	case "tasks":
		handler = tasksHandler
	}

	http.Handle("/", handler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
