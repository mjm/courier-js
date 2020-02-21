package graphql

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/mjm/graphql-go"

	"github.com/mjm/courier-js/internal/trace"
)

func decodeSubscriptionRequest(r *http.Request) (req Request, ok bool) {
	if r.Method != http.MethodGet {
		return
	}

	q := r.URL.Query()
	req.Query = q.Get("q")
	if req.Query == "" {
		return
	}

	req.OperationName = q.Get("op")
	if req.OperationName == "" {
		return
	}

	vars := q.Get("v")
	if vars == "" {
		return
	}

	if err := json.Unmarshal([]byte(vars), &req.Variables); err != nil {
		log.Printf("error decoding subscription variables: %v", err)
		return
	}

	ok = true
	return
}

func (h *Handler) handleSubscriptionRequest(ctx context.Context, w http.ResponseWriter, params Request) {
	ch, err := h.Schema.Subscribe(ctx, params.Query, params.OperationName, params.Variables)
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		err = fmt.Errorf("streaming is not supported")
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Connection", "keep-alive")

	for res := range ch {
		res := res.(*graphql.Response)
		payload, err := json.Marshal(res)
		if err != nil {
			trace.Error(ctx, err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		fmt.Fprintf(w, "data: %s\n\n", string(payload))
		flusher.Flush()
	}
}
