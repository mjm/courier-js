package handler

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/graph-gophers/graphql-go"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace"
)

var schema *graphql.Schema
var auther *auth.Authenticator

func init() {
	// TODO provide real config values
	trace.Init(trace.Config{})

	s, err := ioutil.ReadFile("schema.graphql")
	if err != nil {
		panic(err)
	}

	schema = graphql.MustParseSchema(string(s), &resolvers.Root{}, graphql.Tracer(trace.GraphQLTracer{}))

	auther = &auth.Authenticator{
		AuthDomain: os.Getenv("AUTH_DOMAIN"),
	}
}

// Handler handles GraphQL requests.
func Handler(w http.ResponseWriter, r *http.Request) {
	// wrap the whole request in a trace
	ctx := trace.Start(r.Context(), "HTTP request")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"http.url":    r.URL.Path,
		"http.method": r.Method,
	})

	var params struct {
		Query         string                 `json:"query"`
		OperationName string                 `json:"operationName"`
		Variables     map[string]interface{} `json:"variables"`
	}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	childCtx := auther.Authenticate(ctx, r)

	response := schema.Exec(childCtx, params.Query, params.OperationName, params.Variables)
	responseJSON, err := json.Marshal(response)
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
