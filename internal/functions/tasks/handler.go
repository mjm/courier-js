package tasks

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write"
	writefeeds "github.com/mjm/courier-js/internal/write/feeds"
	writetweets "github.com/mjm/courier-js/internal/write/tweets"
)

var (
	ErrUnknownType = errors.New("unknown task type")
)

type Handler struct {
	commandBus *write.CommandBus
}

func NewHandler(commandBus *write.CommandBus, _ *writetweets.CommandHandler, _ *writefeeds.CommandHandler) *Handler {
	return &Handler{
		commandBus: commandBus,
	}
}

func (h *Handler) HandleHTTP(ctx context.Context, _ http.ResponseWriter, r *http.Request) error {
	span := trace.SpanFromContext(ctx)

	taskName := r.Header.Get("X-CloudTasks-TaskName")
	queueName := r.Header.Get("X-CloudTasks-QueueName")
	span.SetAttributes(
		keys.TaskName(taskName),
		key.String("messaging.message_id", taskName),
		key.String("messaging.system", "google_cloud_tasks"),
		key.String("messaging.destination_kind", "queue"),
		key.String("messaging.destination", queueName),
		key.String("messaging.operation", "process"))

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	r.Body.Close()

	var a any.Any
	if err := proto.Unmarshal(b, &a); err != nil {
		return err
	}

	span.SetAttributes(key.String("task.type_url", a.TypeUrl))

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
		return err
	}

	span.SetAttributes(key.String("task.type", fmt.Sprintf("%T", msg.Message)))

	switch task := msg.Message.(type) {
	case *tweets.PostTweetTask:
		id := model.TweetGroupIDFromParts(task.UserId, model.FeedID(task.FeedId), task.ItemId)
		_, err = h.commandBus.Run(ctx, writetweets.PostCommand{
			TweetGroupID: id,
			Autopost:     task.Autopost,
			TaskName:     taskName,
		})
	case *feeds.RefreshFeedTask:
		_, err = h.commandBus.Run(ctx, writefeeds.RefreshCommand{
			UserID: task.UserId,
			FeedID: model.FeedID(task.FeedId),
		})
	default:
		err = fmt.Errorf("%w %T", ErrUnknownType, msg.Message)
	}

	return err
}
