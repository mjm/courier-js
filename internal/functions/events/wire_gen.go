// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package events

import (
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

// Injectors from wire.go:

func InitializeHandler(gcpConfig secret.GCPConfig) (*PubSubHandler, error) {
	client, err := secret.NewSecretManager(gcpConfig)
	if err != nil {
		return nil, err
	}
	gcpSecretKeeper := secret.NewGCPSecretKeeper(gcpConfig, client)
	config, err := trace.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	bus := event.NewBus()
	dbConfig, err := db.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	dbDB, err := db.New(dbConfig)
	if err != nil {
		return nil, err
	}
	eventRecorder := user.NewEventRecorder(dbDB, bus)
	pusherClient, err := event.NewPusherClient(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	pusher := NewPusher(bus, pusherClient)
	pushNotifications, err := event.NewBeamsClient(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	tweetQueries := tweets.NewTweetQueries(dbDB, bus)
	notifier := notifications.NewNotifier(bus, pushNotifications, tweetQueries)
	pubSubHandler := NewPubSubHandler(config, bus, eventRecorder, pusher, notifier)
	return pubSubHandler, nil
}
