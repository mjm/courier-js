package postqueued

import (
	"context"

	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/tweets"
)

type Handler struct {
	commandBus *write.CommandBus
}

func NewHandler(traceCfg trace.Config, commandBus *write.CommandBus, _ *tweets.CommandHandler) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		commandBus: commandBus,
	}
}

func (h *Handler) HandleEvent(ctx context.Context, _ interface{}) error {
	if _, err := h.commandBus.Run(ctx, tweets.PostQueuedCommand{}); err != nil {
		return err
	}
	return nil
}
