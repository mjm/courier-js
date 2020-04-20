package tweets

import (
	"context"
	"fmt"
	"time"

	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/write"
)

var EventHandlerSet = wire.NewSet(DefaultSet, NewEventHandler)

type EventHandler struct {
	commandBus *write.CommandBus
}

func NewEventHandler(
	commandBus *write.CommandBus,
	events event.Source,
	_ *CommandHandler,
) *EventHandler {
	h := &EventHandler{
		commandBus: commandBus,
	}
	events.Notify(h)
	return h
}

func (h *EventHandler) HandleEvent(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "tweets.HandleEvent",
		trace.WithAttributes(key.String("event.type", fmt.Sprintf("%T", evt))))
	defer span.End()

	switch evt := evt.(type) {

	case feeds.PostsImported:
		var pubAt *time.Time
		if evt.OldestPublishedAt != "" {
			t, err := time.Parse(time.RFC3339, evt.OldestPublishedAt)
			if err != nil {
				span.RecordError(ctx, err)
				return
			}
			pubAt = &t
		}
		if _, err := h.commandBus.Run(ctx, ImportTweetsCommand{
			UserID:          evt.UserId,
			FeedID:          model.FeedID(evt.FeedId),
			OldestPublished: pubAt,
		}); err != nil {
			span.RecordError(ctx, err)
		}

	case feeds.FeedSubscribed:
		if _, err := h.commandBus.Run(ctx, ImportTweetsCommand{
			UserID: evt.UserId,
			FeedID: model.FeedID(evt.FeedId),
		}); err != nil {
			span.RecordError(ctx, err)
		}

	}
}
