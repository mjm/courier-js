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
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
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
	tweetQueriesDynamo := tweets.NewTweetQueriesDynamo(dynamoDB, dynamoConfig)
	bus := event.NewBus()
	tasksConfig, err := tasks.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	tasksTasks, err := tasks.New(tasksConfig, gcpConfig)
	if err != nil {
		return nil, err
	}
	clock := clockwork.NewRealClock()
	feedRepository := shared.NewFeedRepository(dynamoDB, dynamoConfig, clock)
	postRepository := shared.NewPostRepository(dynamoDB, dynamoConfig, clock)
	commandHandler := feeds2.NewCommandHandler(writeCommandBus, bus, tasksTasks, feedRepository, postRepository)
	authConfig, err := auth.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	twitterConfig, err := tweets2.NewTwitterConfig(loader)
	if err != nil {
		return nil, err
	}
	externalTweetRepository := tweets2.NewExternalTweetRepository(authConfig, twitterConfig)
	management, err := auth.NewManagementClient(authConfig)
	if err != nil {
		return nil, err
	}
	keyManagementClient, err := tweets2.NewKeyManagementClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	billingConfig, err := billing.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	api := billing.NewClient(billingConfig)
	userRepository := tweets2.NewUserRepository(management, keyManagementClient, gcpConfig, api)
	tweetRepository := shared.NewTweetRepository(dynamoDB, dynamoConfig, clock)
	tweetsCommandHandler := tweets2.NewCommandHandler(writeCommandBus, bus, tasksTasks, externalTweetRepository, userRepository, feedRepository, tweetRepository)
	eventHandler := tweets2.NewEventHandler(writeCommandBus, bus, tweetsCommandHandler)
	eventRepository := shared.NewEventRepository(dynamoDB, dynamoConfig, clock)
	eventRecorder := user.NewEventRecorder(eventRepository, clock, bus)
	app := newApp(writeCommandBus, feedQueriesDynamo, tweetQueriesDynamo, commandHandler, tweetsCommandHandler, eventHandler, eventRecorder)
	return app, nil
}
