package graphql

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/mjm/graphql-go"
	"github.com/mjm/graphql-go/errors"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/loader"
)

type Handler struct {
	Schema        *graphql.Schema
	Authenticator *auth.Authenticator
}

func NewHandler(schema *graphql.Schema, auther *auth.Authenticator, _ *event.Publisher) *Handler {
	return &Handler{
		Schema:        schema,
		Authenticator: auther,
	}
}

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	span := trace.SpanFromContext(ctx)

	// Set CORS headers for the preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Apollo-Tracing")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		return nil
	}

	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
	w.Header().Set("Vary", "Origin")

	childCtx, err := h.Authenticator.Authenticate(ctx, r)
	if err != nil {
		span.RecordError(ctx, err)
		return writeResponse(ctx, w, errResponse(err))
	}
	childCtx = loader.WithLoaderCache(childCtx)

	var params Request
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		return status.Error(codes.InvalidArgument, err.Error())
	}

	response := h.Schema.Exec(childCtx, params.Query, params.OperationName, params.Variables)
	for _, err := range response.Errors {
		if err.ResolverError != nil {
			if s, ok := status.FromError(err.ResolverError); ok {
				err.Message = s.Message()
				newExt := make(map[string]interface{})
				for k, v := range err.Extensions {
					newExt[k] = v
				}
				newExt["code"] = s.Code().String()
				err.Extensions = newExt
			}
		}
	}
	return writeResponse(ctx, w, response)
}

func errResponse(err error) *graphql.Response {
	s := status.Convert(err)
	return &graphql.Response{
		Data: json.RawMessage("null"),
		Errors: []*errors.QueryError{
			{
				Message: s.Message(),
				Extensions: map[string]interface{}{
					"code": s.Code().String(),
				},
			},
		},
	}
}

func writeResponse(ctx context.Context, w http.ResponseWriter, resp *graphql.Response) error {
	responseJSON, err := json.Marshal(resp)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
	return nil
}
