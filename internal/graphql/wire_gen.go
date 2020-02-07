// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package graphql

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/write"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
)

// Injectors from wire.go:

func InitializeHandler(schemaString string, authConfig auth.Config, dbConfig db.Config, stripeConfig billing.Config) (*Handler, error) {
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	bus := event.NewBus()
	feedQueries := feeds.NewFeedQueries(dbDB, bus)
	subscriptionQueries := feeds.NewSubscriptionQueries(dbDB, bus)
	postQueries := feeds.NewPostQueries(dbDB, bus)
	eventQueries := user.NewEventQueries(dbDB)
	queries := resolvers.Queries{
		Feeds:             feedQueries,
		FeedSubscriptions: subscriptionQueries,
		Posts:             postQueries,
		Events:            eventQueries,
	}
	commandBus := write.NewCommandBus()
	feedRepository := feeds2.NewFeedRepository(dbDB)
	subscriptionRepository := feeds2.NewSubscriptionRepository(dbDB)
	postRepository := feeds2.NewPostRepository(dbDB)
	commandHandler := feeds2.NewCommandHandler(commandBus, bus, feedRepository, subscriptionRepository, postRepository)
	tweetRepository := tweets.NewTweetRepository(dbDB)
	tweetsCommandHandler := tweets.NewCommandHandler(commandBus, bus, tweetRepository)
	root := resolvers.New(dbDB, queries, commandBus, commandHandler, tweetsCommandHandler)
	schema, err := NewSchema(schemaString, root)
	if err != nil {
		return nil, err
	}
	authenticator, err := auth.NewAuthenticator(authConfig)
	if err != nil {
		return nil, err
	}
	api := billing.NewClient(stripeConfig)
	eventRecorder := user2.NewEventRecorder(dbDB, bus)
	handler := NewHandler(schema, authenticator, dbDB, api, eventRecorder)
	return handler, nil
}
