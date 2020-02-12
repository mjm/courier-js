package graphql

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/errors"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/user"
)

type Handler struct {
	Schema        *graphql.Schema
	Authenticator *auth.Authenticator
}

func NewHandler(traceCfg trace.Config, schema *graphql.Schema, auther *auth.Authenticator, _ *user.EventRecorder) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		Schema:        schema,
		Authenticator: auther,
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

	// Set CORS headers for the preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		return
	}
	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
	w.Header().Set("Vary", "Origin")

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
				{
					Message: err.Error(),
				},
			},
		}
		writeResponse(ctx, w, response)
		return
	}

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
