package graphql

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/errors"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/user"
)

type Handler struct {
	Schema        *graphql.Schema
	Authenticator *auth.Authenticator
	DB            db.DB
	Stripe        *client.API
}

func NewHandler(schema *graphql.Schema, auther *auth.Authenticator, db db.DB, sc *client.API, _ *user.EventRecorder) *Handler {
	return &Handler{
		Schema:        schema,
		Authenticator: auther,
		DB:            db,
		Stripe:        sc,
	}
}

var _ http.Handler = (*Handler)(nil)

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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

	childCtx, err := h.Authenticator.Authenticate(ctx, r)
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

	childCtx = loaders.WithLoaders(childCtx, h.DB, h.Stripe)
	childCtx = loader.WithLoaderCache(childCtx)

	response := h.Schema.Exec(childCtx, params.Query, params.OperationName, params.Variables)
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
