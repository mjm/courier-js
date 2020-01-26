package graphql

import (
	"github.com/graph-gophers/graphql-go"

	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace"
)

func NewSchema(schemaString string, resolver *resolvers.Root) (*graphql.Schema, error) {
	return graphql.ParseSchema(schemaString, resolver, graphql.Tracer(trace.GraphQLTracer{}))
}
