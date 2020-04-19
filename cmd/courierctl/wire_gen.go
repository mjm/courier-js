// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package main

import (
	"github.com/jonboulle/clockwork"
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/urfave/cli/v2"
)

// Injectors from wire.go:

func setupApp(gcpConfig secret.GCPConfig) (*cli.App, error) {
	writeCommandBus := write.NewCommandBus()
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
	feedQueriesDynamo := feeds.NewFeedQueriesDynamo(dynamoDB, dynamoConfig)
	bus := event.NewBus()
	tasksConfig, err := tasks.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	tasksTasks, err := tasks.New(tasksConfig, gcpConfig)
	if err != nil {
		return nil, err
	}
	dbConfig, err := db.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	feedRepository := feeds2.NewFeedRepository(dbDB)
	subscriptionRepository := feeds2.NewSubscriptionRepository(dbDB)
	postRepository := feeds2.NewPostRepository(dbDB)
	clock := clockwork.NewRealClock()
	sharedFeedRepository := shared.NewFeedRepository(dynamoDB, dynamoConfig, clock)
	sharedPostRepository := shared.NewPostRepository(dynamoDB, dynamoConfig, clock)
	commandHandler := feeds2.NewCommandHandler(writeCommandBus, bus, tasksTasks, feedRepository, subscriptionRepository, postRepository, sharedFeedRepository, sharedPostRepository)
	tweetRepository := tweets.NewTweetRepository(dbDB)
	feedSubscriptionRepository := tweets.NewFeedSubscriptionRepository(dbDB)
	tweetsPostRepository := tweets.NewPostRepository(dbDB)
	authConfig, err := auth.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	twitterConfig, err := tweets.NewTwitterConfig(loader)
	if err != nil {
		return nil, err
	}
	externalTweetRepository := tweets.NewExternalTweetRepository(authConfig, twitterConfig)
	management, err := auth.NewManagementClient(authConfig)
	if err != nil {
		return nil, err
	}
	keyManagementClient, err := tweets.NewKeyManagementClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	billingConfig, err := billing.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	api := billing.NewClient(billingConfig)
	userRepository := tweets.NewUserRepository(management, keyManagementClient, gcpConfig, api)
	sharedTweetRepository := shared.NewTweetRepository(dynamoDB, dynamoConfig, clock)
	tweetsCommandHandler := tweets.NewCommandHandler(writeCommandBus, bus, tasksTasks, tweetRepository, feedSubscriptionRepository, tweetsPostRepository, externalTweetRepository, userRepository, sharedFeedRepository, sharedTweetRepository)
	eventHandler := tweets.NewEventHandler(writeCommandBus, bus, feedSubscriptionRepository, tweetsPostRepository, tweetsCommandHandler)
	app := newApp(writeCommandBus, feedQueriesDynamo, commandHandler, tweetsCommandHandler, eventHandler)
	return app, nil
}
