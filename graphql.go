package courier

import (
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/functions/graphql"
)

var initGraphql sync.Once
var graphQLHandler = functions.NewHTTP("graphql", func() (functions.HTTPHandler, error) {
	s, err := ioutil.ReadFile("schema.graphql")
	if err != nil {
		panic(err)
	}

	return graphql.InitializeHandler(string(s), secretConfig)
})

// GraphQL handles GraphQL requests.
func GraphQL(w http.ResponseWriter, r *http.Request) {
	graphQLHandler.ServeHTTP(w, r)
}
