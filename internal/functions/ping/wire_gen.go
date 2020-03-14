// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package ping

import (
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	feeds2 "github.com/mjm/courier-js/internal/write/feeds"
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
	dbConfig, err := db.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	feedQueries := feeds.NewFeedQueries(dbDB)
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
	tasksTasks, err := tasks.New(tasksConfig, gcpConfig)
	if err != nil {
		return nil, err
	}
	feedRepository := feeds2.NewFeedRepository(dbDB)
	subscriptionRepository := feeds2.NewSubscriptionRepository(dbDB)
	postRepository := feeds2.NewPostRepository(dbDB)
	commandHandler := feeds2.NewCommandHandler(commandBus, publisher, tasksTasks, feedRepository, subscriptionRepository, postRepository)
	handler := NewHandler(feedQueries, commandBus, commandHandler)
	return handler, nil
}
