package main

import (
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/graphql"
)

var graphQLHandler = functions.NewHTTP("graphql", func() (functions.HTTPHandler, error) {
	return graphql.InitializeLambda()
})
