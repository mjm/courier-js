package handler

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"

	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace"
)

var schema *graphql.Schema
var handler http.Handler

func init() {
	trace.Init(trace.Config{})

	s, err := ioutil.ReadFile("schema.graphql")
	if err != nil {
		panic(err)
	}

	schema = graphql.MustParseSchema(string(s), &resolvers.Root{}, graphql.Tracer(trace.GraphQLTracer{}))
	handler = &relay.Handler{Schema: schema}
}

// Handler handles GraphQL requests.
func Handler(w http.ResponseWriter, r *http.Request) {
	var params struct {
		Query         string                 `json:"query"`
		OperationName string                 `json:"operationName"`
		Variables     map[string]interface{} `json:"variables"`
	}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := schema.Exec(r.Context(), params.Query, params.OperationName, params.Variables)
	responseJSON, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
