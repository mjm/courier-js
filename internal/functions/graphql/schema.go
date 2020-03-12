package graphql

import (
	"github.com/mjm/graphql-go"

	"github.com/mjm/courier-js/internal/resolvers"
)

func NewSchema(schemaString string, resolver *resolvers.Root) (*graphql.Schema, error) {
	return graphql.ParseSchema(schemaString, resolver,
		graphql.Tracer(GraphQLTracer{}),
		graphql.UseFieldResolvers())
}
