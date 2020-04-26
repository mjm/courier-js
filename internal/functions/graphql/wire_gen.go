// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package graphql

import (
	"github.com/jonboulle/clockwork"
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
	"github.com/mjm/courier-js/internal/write"
	billing3 "github.com/mjm/courier-js/internal/write/billing"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
)

// Injectors from wire.go:

func InitializeHandler(schemaString string, gcpConfig secret.GCPConfig) (*Handler, error) {
	defaultEnv := &config.DefaultEnv{}
	client, err := secret.NewSecretManager(gcpConfig)
	if err != nil {
		return nil, err
	}
	gcpSecretKeeper := secret.NewGCPSecretKeeper(gcpConfig, client)
	loader := config.NewLoader(defaultEnv, gcpSecretKeeper)
	dynamoConfig, err := db.NewDynamoConfig(loader)
	if err != nil {
		return nil, err
	}
	dynamoDB, err := db.NewDynamoDB(dynamoConfig)
	if err != nil {
		return nil, err
	}
	feedQueries := feeds.NewFeedQueries(dynamoDB, dynamoConfig)
	postQueries := feeds.NewPostQueries(dynamoDB, dynamoConfig)
	tweetQueries := tweets.NewTweetQueries(dynamoDB, dynamoConfig)
	eventQueries := user.NewEventQueries(dynamoDB, dynamoConfig)
	billingConfig, err := billing.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	api := billing.NewClient(billingConfig)
	customerQueries := billing2.NewCustomerQueries(api)
	authConfig, err := auth.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	management, err := auth.NewManagementClient(authConfig)
	if err != nil {
		return nil, err
	}
	subscriptionQueries := billing2.NewSubscriptionQueries(api, management)
	queries := resolvers.Queries{
		Feeds:         feedQueries,
		Posts:         postQueries,
		Tweets:        tweetQueries,
		Events:        eventQueries,
		Customers:     customerQueries,
		Subscriptions: subscriptionQueries,
	}
	commandBus := write.NewCommandBus()
	publisherConfig, err := event.NewPublisherConfig(loader)
	if err != nil {
		return nil, err
	}
	pubsubClient, err := event.NewPubSubClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	publisher := event.NewPublisher(publisherConfig, pubsubClient)
	tasksConfig, err := tasks.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	tasksTasks, err := tasks.New(tasksConfig)
	if err != nil {
		return nil, err
	}
	clock := clockwork.NewRealClock()
	feedRepository := shared.NewFeedRepository(dynamoDB, dynamoConfig, clock)
	postRepository := shared.NewPostRepository(dynamoDB, dynamoConfig, clock)
	commandHandler := feeds2.NewCommandHandler(commandBus, publisher, tasksTasks, feedRepository, postRepository)
	twitterConfig, err := tweets2.NewTwitterConfig(loader)
	if err != nil {
		return nil, err
	}
	externalTweetRepository := tweets2.NewExternalTweetRepository(authConfig, twitterConfig)
	userRepository := tweets2.NewUserRepository(management, api)
	tweetRepository := shared.NewTweetRepository(dynamoDB, dynamoConfig, clock)
	tweetsCommandHandler := tweets2.NewCommandHandler(commandBus, publisher, tasksTasks, externalTweetRepository, userRepository, feedRepository, tweetRepository)
	customerRepository := billing3.NewCustomerRepository(api)
	subscriptionRepository := billing3.NewSubscriptionRepository(api)
	billingCommandHandler := billing3.NewCommandHandler(commandBus, publisher, billingConfig, customerRepository, subscriptionRepository)
	userUserRepository := user2.NewUserRepository(management)
	userCommandHandler := user2.NewCommandHandler(commandBus, publisher, userUserRepository)
	root := resolvers.New(queries, commandBus, commandHandler, tweetsCommandHandler, billingCommandHandler, userCommandHandler)
	schema, err := NewSchema(schemaString, root)
	if err != nil {
		return nil, err
	}
	jwksClient := auth.NewJWKSClient(authConfig)
	authenticator := auth.NewAuthenticator(authConfig, management, jwksClient)
	handler := NewHandler(schema, authenticator, publisher)
	return handler, nil
}
