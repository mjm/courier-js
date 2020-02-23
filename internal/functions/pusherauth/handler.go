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

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/trace"
)

type Handler struct {
	authenticator *auth.Authenticator
	pusher        *pusher.Client
	beams         pushnotifications.PushNotifications
}

func NewHandler(traceCfg trace.Config, auther *auth.Authenticator, client *pusher.Client, beams pushnotifications.PushNotifications) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		authenticator: auther,
		pusher:        client,
		beams:         beams,
	}
}

var _ functions.HTTPHandler = (*Handler)(nil)

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
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
		return functions.WrapHTTPError(err, http.StatusForbidden)
	}

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return functions.WrapHTTPError(err, http.StatusForbidden)
	}

	trace.UserID(ctx, userID)

	switch r.Method {
	case http.MethodGet:
		expectedUserID := r.FormValue("user_id")
		trace.AddField(ctx, "user_id_expected", expectedUserID)

		if expectedUserID != userID {
			return functions.WrapHTTPError(fmt.Errorf("user ID does not match"), http.StatusUnauthorized)
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

		trace.AddField(ctx, "auth.params_length", len(params))

		sanitizedUserID := strings.ReplaceAll(userID, "|", "_")
		trace.AddField(ctx, "user_id_sanitized", sanitizedUserID)
		channelName := r.FormValue("channel_name")
		trace.AddField(ctx, "event.channel_name", channelName)

		if channelName != fmt.Sprintf("private-events-%s", sanitizedUserID) {
			err := fmt.Errorf("user %q cannot subscribe to channel %q", userID, channelName)
			return functions.WrapHTTPError(err, http.StatusForbidden)
		}

		res, err := h.pusher.AuthenticatePrivateChannel(params)
		if err != nil {
			return err
		}

		trace.AddField(ctx, "auth.response_length", len(res))

		fmt.Fprintf(w, string(res))
		return nil
	}

	return fmt.Errorf("unexpected HTTP method %q", r.Method)
}
