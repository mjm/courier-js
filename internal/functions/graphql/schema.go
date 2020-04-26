package graphql

import (
	"io/ioutil"

	"github.com/mjm/graphql-go"

	"github.com/mjm/courier-js/internal/resolvers"
)

type SchemaFile string
type SchemaString string

func NewSchema(schemaString SchemaString, resolver *resolvers.Root) (*graphql.Schema, error) {
	return graphql.ParseSchema(string(schemaString), resolver,
		graphql.Tracer(GraphQLTracer{}),
		graphql.UseFieldResolvers())
}

func LoadSchemaFromFile(filename SchemaFile) (SchemaString, error) {
	s, err := ioutil.ReadFile(string(filename))
	if err != nil {
		return "", err
	}

	return SchemaString(s), nil
}
