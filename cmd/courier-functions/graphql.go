package main

import (
	"io/ioutil"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/graphql"
)

var graphQLHandler = functions.NewHTTP("graphql", func() (functions.HTTPHandler, error) {
	s, err := ioutil.ReadFile("schema.graphql")
	if err != nil {
		panic(err)
	}

	return graphql.InitializeHandler(graphql.SchemaString(s), secretConfig)
})
