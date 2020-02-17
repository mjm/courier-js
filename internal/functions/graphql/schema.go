package graphql

import (
	"github.com/mjm/graphql-go"

	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace"
)

func NewSchema(schemaString string, resolver *resolvers.Root) (*graphql.Schema, error) {
	return graphql.ParseSchema(schemaString, resolver,
		graphql.Tracer(trace.GraphQLTracer{}),
		graphql.UseFieldResolvers())
}
