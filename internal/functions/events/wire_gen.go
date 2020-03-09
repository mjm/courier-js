// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package events

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
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
	bus := event.NewBus()
	dbConfig, err := db.NewConfig(loader)
	if err != nil {
		return nil, err
	}
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	eventRecorder := user.NewEventRecorder(dbDB, bus)
	pusherConfig, err := event.NewPusherConfig(loader)
	if err != nil {
		return nil, err
	}
	pusherClient, err := event.NewPusherClient(pusherConfig)
	if err != nil {
		return nil, err
	}
	pusher := NewPusher(bus, pusherClient)
	pushNotifications, err := event.NewBeamsClient(pusherConfig)
	if err != nil {
		return nil, err
	}
	tweetQueries := tweets.NewTweetQueries(dbDB)
	notifier := notifications.NewNotifier(bus, pushNotifications, tweetQueries)
	commandBus := write.NewCommandBus()
	feedSubscriptionRepository := tweets2.NewFeedSubscriptionRepository(dbDB)
	postRepository := tweets2.NewPostRepository(dbDB)
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
	tweetRepository := tweets2.NewTweetRepository(dbDB)
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
	commandHandler := tweets2.NewCommandHandler(commandBus, publisher, tasksTasks, tweetRepository, feedSubscriptionRepository, postRepository, externalTweetRepository, userRepository)
	eventHandler := tweets2.NewEventHandler(commandBus, bus, feedSubscriptionRepository, postRepository, commandHandler)
	userUserRepository := user2.NewUserRepository(management)
	userCommandHandler := user2.NewCommandHandler(commandBus, publisher, userUserRepository)
	userEventHandler := user2.NewEventHandler(commandBus, bus, userCommandHandler)
	handler := NewHandler(traceConfig, bus, eventRecorder, pusher, notifier, eventHandler, userEventHandler)
	return handler, nil
}
