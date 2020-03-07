package indieauthcb

import (
	"context"
	"net/http"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/functions"
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

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	ctx, err := h.auth.Authenticate(ctx, r)
	if err != nil {
		return functions.WrapHTTPError(err, http.StatusBadRequest)
	}

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		return functions.WrapHTTPError(err, http.StatusBadRequest)
	}

	result, err := completeIndieAuth(ctx, r)
	if err != nil {
		return functions.WrapHTTPError(err, http.StatusBadRequest)
	}

	if _, err := h.commandBus.Run(ctx, tweets.SetupSyndicationCommand{
		UserID: userID,
		URL:    result.URL,
		Token:  result.Token,
	}); err != nil {
		return functions.WrapHTTPError(err, http.StatusBadRequest)
	}

	w.Header().Set("Location", result.Origin)
	w.WriteHeader(http.StatusMovedPermanently)
	return nil
}

func completeIndieAuth(ctx context.Context, r *http.Request) (*indieauth.Result, error) {
	ctx = trace.Start(ctx, "Get IndieAuth token")
	defer trace.Finish(ctx)

	res, err := indieauth.CompleteRequest(ctx, r)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return res, nil
}
