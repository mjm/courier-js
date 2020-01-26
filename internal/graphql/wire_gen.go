// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package graphql

import (
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/resolvers"
)

// Injectors from wire.go:

func InitializeHandler(schemaString string, authConfig auth.Config) (*Handler, error) {
	root := resolvers.New()
	schema, err := NewSchema(schemaString, root)
	if err != nil {
		return nil, err
	}
	authenticator, err := auth.NewAuthenticator(authConfig)
	if err != nil {
		return nil, err
	}
	handler := NewHandler(schema, authenticator)
	return handler, nil
}
