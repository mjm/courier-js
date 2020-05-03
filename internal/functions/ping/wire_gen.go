// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package ping

import (
	"github.com/jonboulle/clockwork"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
)

// Injectors from wire.go:

func InitializeLambda() (*Handler, error) {
	commandBus := write.NewCommandBus()
	defaultEnv := &config.DefaultEnv{}
	awsSecretKeeper, err := secret.NewAWSSecretKeeper()
	if err != nil {
		return nil, err
	}
	loader := config.NewLoader(defaultEnv, awsSecretKeeper)
	sqsPublisherConfig, err := event.NewSQSPublisherConfig(loader)
	if err != nil {
		return nil, err
	}
	sqsPublisher, err := event.NewSQSPublisher(sqsPublisherConfig)
	if err != nil {
		return nil, err
	}
	tasksTasks, err := tasks.New(sqsPublisherConfig)
	if err != nil {
		return nil, err
	}
	dynamoDB, err := db.NewDynamoDB()
	if err != nil {
		return nil, err
	}
	dynamoConfig, err := db.NewDynamoConfig(loader)
	if err != nil {
		return nil, err
	}
	clock := clockwork.NewRealClock()
	feedRepository := shared.NewFeedRepository(dynamoDB, dynamoConfig, clock)
	postRepository := shared.NewPostRepository(dynamoDB, dynamoConfig, clock)
	commandHandler := feeds.NewCommandHandler(commandBus, sqsPublisher, tasksTasks, feedRepository, postRepository)
	handler := NewHandler(commandBus, commandHandler)
	return handler, nil
}
