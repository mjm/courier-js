// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package tasks

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets"
)

// Injectors from wire.go:

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	defaultEnv := &config.DefaultEnv{}
	client, err := secret.NewSecretManager(gcpConfig)
	if err != nil {
		return nil, err
	}
	gcpSecretKeeper := secret.NewGCPSecretKeeper(gcpConfig, client)
	loader := config.NewLoader(defaultEnv, gcpSecretKeeper)
	traceConfig, err := trace.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	commandBus := write.NewCommandBus()
	publisherConfig := event.NewPublisherConfig(gcpConfig)
	pubsubClient, err := event.NewPubSubClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	bus := event.NewBus()
	publisher := event.NewPublisher(publisherConfig, pubsubClient, bus)
	tasksConfig := tasks.NewConfig()
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
	tweetRepository := tweets.NewTweetRepository(dbDB)
	feedSubscriptionRepository := tweets.NewFeedSubscriptionRepository(dbDB)
	postRepository := tweets.NewPostRepository(dbDB)
	authConfig, err := auth.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	twitterConfig, err := tweets.NewTwitterConfigFromSecrets(gcpSecretKeeper)
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
	commandHandler := tweets.NewCommandHandler(commandBus, bus, tasksTasks, tweetRepository, feedSubscriptionRepository, postRepository, externalTweetRepository, userRepository)
	feedRepository := feeds.NewFeedRepository(dbDB)
	subscriptionRepository := feeds.NewSubscriptionRepository(dbDB)
	feedsPostRepository := feeds.NewPostRepository(dbDB)
	feedsCommandHandler := feeds.NewCommandHandler(commandBus, bus, feedRepository, subscriptionRepository, feedsPostRepository)
	handler := NewHandler(traceConfig, commandBus, publisher, commandHandler, feedsCommandHandler)
	return handler, nil
}
