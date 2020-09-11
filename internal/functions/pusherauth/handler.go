package pusherauth

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	pushnotifications "github.com/pusher/push-notifications-go"
	"github.com/pusher/pusher-http-go"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var (
	ErrNoMatch = status.Error(codes.Unauthenticated, "user ID does not match")
)

type Handler struct {
	authenticator *auth.Authenticator
	pusher        *pusher.Client
	beams         pushnotifications.PushNotifications
}

func NewHandler(auther *auth.Authenticator, client *pusher.Client, beams pushnotifications.PushNotifications) *Handler {
	return &Handler{
		authenticator: auther,
		pusher:        client,
		beams:         beams,
	}
}

var _ functions.HTTPHandler = (*Handler)(nil)

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	span := trace.SpanFromContext(ctx)

	// Set CORS headers for the preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
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

	ctx, err := h.authenticator.Authenticate(ctx, r)
	if err != nil {
		return err
	}

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return err
	}

	span.SetAttributes(keys.UserID(userID))

	switch r.Method {
	case http.MethodGet:
		expectedUserID := r.FormValue("user_id")
		span.SetAttributes(kv.String("user_id_expected", expectedUserID))

		if expectedUserID != userID {
			return ErrNoMatch
		}

		beamsToken, err := h.beams.GenerateToken(userID)
		if err != nil {
			return err
		}

		if err := json.NewEncoder(w).Encode(beamsToken); err != nil {
			return err
		}

		return nil

	case http.MethodPost:
		params, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return err
		}
		r.Body.Close()
		r.Body = ioutil.NopCloser(bytes.NewBuffer(params))

		span.SetAttributes(kv.Int("auth.params_length", len(params)))

		sanitizedUserID := strings.ReplaceAll(userID, "|", "_")
		span.SetAttributes(kv.String("user_id_sanitized", sanitizedUserID))
		channelName := r.FormValue("channel_name")
		span.SetAttributes(kv.String("event.channel_name", channelName))

		if channelName != fmt.Sprintf("private-events-%s", sanitizedUserID) {
			return status.Errorf(codes.PermissionDenied, "user %q cannot subscribe to channel %q", userID, channelName)
		}

		res, err := h.pusher.AuthenticatePrivateChannel(params)
		if err != nil {
			return err
		}

		span.SetAttributes(kv.Int("auth.response_length", len(res)))

		fmt.Fprintf(w, string(res))
		return nil
	}

	return status.Errorf(codes.Unimplemented, "unexpected HTTP method %s", r.Method)
}
