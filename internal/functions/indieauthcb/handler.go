package indieauthcb

import (
	"context"
	"net/http"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/pkg/indieauth"
)

type Handler struct {
	commandBus *write.CommandBus
	auth       *auth.Authenticator
}

func NewHandler(traceCfg trace.Config, commandBus *write.CommandBus, auth *auth.Authenticator, _ *tweets.CommandHandler) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		commandBus: commandBus,
		auth:       auth,
	}
}

func (h *Handler) HandleHTTP(w http.ResponseWriter, r *http.Request) {
	defer trace.Flush()

	ctx := trace.Start(r.Context(), "Complete IndieAuth")
	defer trace.Finish(ctx)

	ctx, err := h.auth.Authenticate(ctx, r)
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := completeIndieAuth(ctx, r)
	if err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if _, err := h.commandBus.Run(ctx, tweets.SetupSyndicationCommand{
		UserID: userID,
		URL:    result.URL,
		Token:  result.Token,
	}); err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Location", result.Origin)
	w.WriteHeader(http.StatusMovedPermanently)
}

func completeIndieAuth(ctx context.Context, r *http.Request) (*indieauth.Result, error) {
	ctx = trace.Start(ctx, "Get IndieAuth token")
	defer trace.Finish(ctx)

	res, err := indieauth.Complete(ctx, r)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return res, nil
}
