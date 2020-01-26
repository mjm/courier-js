package handler

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/errors"

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

	auther, err = auth.NewAuthenticator(auth.Config{
		AuthDomain:   os.Getenv("AUTH_DOMAIN"),
		ClientID:     os.Getenv("BACKEND_CLIENT_ID"),
		ClientSecret: os.Getenv("BACKEND_CLIENT_SECRET"),
	})
	if err != nil {
		panic(err)
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

	childCtx, err := auther.Authenticate(ctx, r)
	if err != nil {
		trace.Error(ctx, err)
		response := &graphql.Response{
			Data: json.RawMessage("null"),
			Errors: []*errors.QueryError{
				&errors.QueryError{
					Message: err.Error(),
				},
			},
		}
		writeResponse(ctx, w, response)
		return
	}

	response := schema.Exec(childCtx, params.Query, params.OperationName, params.Variables)
	writeResponse(ctx, w, response)
}

func writeResponse(ctx context.Context, w http.ResponseWriter, resp *graphql.Response) {
	responseJSON, err := json.Marshal(resp)
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
