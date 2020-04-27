package events

import (
	"context"
	"errors"
	"fmt"

	"github.com/golang/protobuf/ptypes"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/write"
	writefeeds "github.com/mjm/courier-js/internal/write/feeds"
	writetweets "github.com/mjm/courier-js/internal/write/tweets"
)

var (
	ErrUnknownType = errors.New("unknown task type")
)

type TaskHandler struct {
	commandBus *write.CommandBus
}

func NewTaskHandler(commandBus *write.CommandBus, events event.Source, _ *writefeeds.CommandHandler, _ *writetweets.CommandHandler) *TaskHandler {
	h := &TaskHandler{
		commandBus: commandBus,
	}
	events.Notify(h)
	return h
}

func (h *TaskHandler) HandleEvent(ctx context.Context, evt interface{}) {
	e, ok := evt.(tasks.FireTaskEvent)
	if !ok {
		return
	}

	ctx, span := tracer.Start(ctx, "tasks.HandleEvent",
		trace.WithAttributes(key.String("task.type_url", e.Task.TypeUrl)))
	defer span.End()

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(e.Task, &msg); err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(key.String("task.type", fmt.Sprintf("%T", msg.Message)))

	var err error

	switch task := msg.Message.(type) {
	case *tweets.PostTweetTask:
		id := model.TweetGroupIDFromParts(task.UserId, model.FeedID(task.FeedId), task.ItemId)
		_, err = h.commandBus.Run(ctx, writetweets.PostCommand{
			TweetGroupID: id,
			Autopost:     task.Autopost,
			TaskName:     e.Name,
		})
	case *feeds.RefreshFeedTask:
		_, err = h.commandBus.Run(ctx, writefeeds.RefreshCommand{
			UserID:   task.UserId,
			FeedID:   model.FeedID(task.FeedId),
			TaskName: e.Name,
		})
	default:
		err = fmt.Errorf("%w %T", ErrUnknownType, msg.Message)
	}

	if err != nil {
		span.RecordError(ctx, err)
	}
}
