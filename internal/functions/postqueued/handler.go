package postqueued

import (
	"context"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/tweets"
)

type Handler struct {
	commandBus *write.CommandBus
}

func NewHandler(traceCfg trace.Config, commandBus *write.CommandBus, _ *tweets.CommandHandler, _ *event.Publisher) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		commandBus: commandBus,
	}
}

func (h *Handler) HandleEvent(ctx context.Context, _ interface{}) error {
	defer trace.Flush()

	ctx = trace.Start(ctx, "Cron event: post queued tweets")
	defer trace.Finish(ctx)

	if _, err := h.commandBus.Run(ctx, tweets.PostQueuedCommand{}); err != nil {
		trace.Error(ctx, err)
		return err
	}
	return nil
}
