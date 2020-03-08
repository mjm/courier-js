// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package stripecb

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/event"
	billing2 "github.com/mjm/courier-js/internal/read/billing"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

// Injectors from wire.go:

func InitializeHandler(gcpConfig secret.GCPConfig) (*Handler, error) {
	client, err := secret.NewSecretManager(gcpConfig)
	if err != nil {
		return nil, err
	}
	gcpSecretKeeper := secret.NewGCPSecretKeeper(gcpConfig, client)
	traceConfig, err := trace.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	billingConfig, err := billing.NewConfigFromSecrets(gcpSecretKeeper)
	if err != nil {
		return nil, err
	}
	bus := event.NewBus()
	api := billing.NewClient(billingConfig)
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
	subscriptionQueries := billing2.NewSubscriptionQueries(api, management)
	publisherConfig := event.NewPublisherConfig(gcpConfig)
	pubsubClient, err := event.NewPubSubClient(gcpConfig)
	if err != nil {
		return nil, err
	}
	publisher := event.NewPublisher(publisherConfig, pubsubClient, bus)
	handler := NewHandler(traceConfig, billingConfig, bus, subscriptionQueries, publisher)
	return handler, nil
}
