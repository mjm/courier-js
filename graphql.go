package courier

import (
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/mjm/courier-js/internal/graphql"
	"github.com/mjm/courier-js/internal/trace"
)

var initGraphql sync.Once
var graphQLHandler *graphql.Handler

// GraphQL handles GraphQL requests.
func GraphQL(w http.ResponseWriter, r *http.Request) {
	initGraphql.Do(func() {
		s, err := ioutil.ReadFile("schema.graphql")
		if err != nil {
			panic(err)
		}

		graphQLHandler, err = graphql.InitializeHandler(string(s), secretConfig)
		if err != nil {
			panic(err)
		}

		trace.SetServiceName("graphql")
	})
	graphQLHandler.ServeHTTP(w, r)
}
