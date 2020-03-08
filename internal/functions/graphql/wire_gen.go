// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package graphql

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	billing2 "github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	billing3 "github.com/mjm/courier-js/internal/write/billing"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
)

// Injectors from wire.go:

func InitializeHandler(schemaString string, gcpConfig secret.GCPConfig) (*Handler, error) {
	client, err := secret.NewSecretManager(gcpConfig)
	if err != nil {
		return nil, err
	}
	gcpSecretKeeper := secret.NewGCPSecretKeeper(gcpConfig, client)
	traceConfig, err := trace.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	dbConfig, err := db.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	bus := event.NewBus()
	feedQueries := feeds.NewFeedQueries(dbDB, bus)
	subscriptionQueries := feeds.NewSubscriptionQueries(dbDB, bus)
	postQueries := feeds.NewPostQueries(dbDB, bus)
	tweetQueries := tweets.NewTweetQueries(dbDB, bus)
	eventQueries := user.NewEventQueries(dbDB)
	billingConfig, err := billing.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	api := billing.NewClient(billingConfig)
	customerQueries := billing2.NewCustomerQueries(api)
	defaultEnv := &config.DefaultEnv{}
	loader := config.NewLoader(defaultEnv, gcpSecretKeeper)
	authConfig, err := auth.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	management, err := auth.NewManagementClient(authConfig)
	if err != nil {
		return nil, err
	}
	billingSubscriptionQueries := billing2.NewSubscriptionQueries(api, management)
	queries := resolvers.Queries{
		Feeds:             feedQueries,
		FeedSubscriptions: subscriptionQueries,
		Posts:             postQueries,
		Tweets:            tweetQueries,
		Events:            eventQueries,
		Customers:         customerQueries,
		Subscriptions:     billingSubscriptionQueries,
	}
	commandBus := write.NewCommandBus()
	tasksConfig := tasks.NewConfig()
	tasksTasks, err := tasks.New(tasksConfig, gcpConfig)
	if err != nil {
		return nil, err
	}
	feedRepository := feeds2.NewFeedRepository(dbDB)
	subscriptionRepository := feeds2.NewSubscriptionRepository(dbDB)
	postRepository := feeds2.NewPostRepository(dbDB)
	commandHandler := feeds2.NewCommandHandler(commandBus, bus, feedRepository, subscriptionRepository, postRepository)
	tweetRepository := tweets2.NewTweetRepository(dbDB)
	feedSubscriptionRepository := tweets2.NewFeedSubscriptionRepository(dbDB)
	tweetsPostRepository := tweets2.NewPostRepository(dbDB)
	twitterConfig, err := tweets2.NewTwitterConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	externalTweetRepository := tweets2.NewExternalTweetRepository(authConfig, twitterConfig)
	keyManagementClient, err := tweets2.NewKeyManagementClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	userRepository := tweets2.NewUserRepository(management, keyManagementClient, gcpConfig, api)
	tweetsCommandHandler := tweets2.NewCommandHandler(commandBus, bus, tasksTasks, tweetRepository, feedSubscriptionRepository, tweetsPostRepository, externalTweetRepository, userRepository)
	customerRepository := billing3.NewCustomerRepository(api)
	billingSubscriptionRepository := billing3.NewSubscriptionRepository(api)
	billingCommandHandler := billing3.NewCommandHandler(commandBus, bus, billingConfig, customerRepository, billingSubscriptionRepository)
	userUserRepository := user2.NewUserRepository(management)
	userCommandHandler := user2.NewCommandHandler(commandBus, bus, userUserRepository)
	root := resolvers.New(queries, commandBus, tasksTasks, commandHandler, tweetsCommandHandler, billingCommandHandler, userCommandHandler)
	schema, err := NewSchema(schemaString, root)
	if err != nil {
		return nil, err
	}
	jwksClient := auth.NewJWKSClient(authConfig)
	authenticator := auth.NewAuthenticator(authConfig, management, jwksClient)
	publisherConfig := event.NewPublisherConfig(gcpConfig)
	pubsubClient, err := event.NewPubSubClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	publisher := event.NewPublisher(publisherConfig, pubsubClient, bus)
	handler := NewHandler(traceConfig, schema, authenticator, publisher)
	return handler, nil
}
