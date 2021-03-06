// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package trace

import (
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/secret"
	"go.opentelemetry.io/otel/sdk/trace"
)

// Injectors from wire.go:

func initProviderLambda(serviceName ServiceName) (*trace.Provider, error) {
	defaultEnv := &config.DefaultEnv{}
	awsSecretKeeper, err := secret.NewAWSSecretKeeper()
	if err != nil {
		return nil, err
	}
	loader := config.NewLoader(defaultEnv, awsSecretKeeper)
	traceConfig, err := NewConfig(loader)
	if err != nil {
		return nil, err
	}
	exporter, err := newExporter(traceConfig)
	if err != nil {
		return nil, err
	}
	provider, err := newProvider(exporter, serviceName)
	if err != nil {
		return nil, err
	}
	return provider, nil
}
