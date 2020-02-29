package tasks

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	writetweets "github.com/mjm/courier-js/internal/write/tweets"
)

type Handler struct {
	commandBus *write.CommandBus
}

func NewHandler(traceCfg trace.Config, commandBus *write.CommandBus, _ *event.Publisher, _ *writetweets.CommandHandler) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		commandBus: commandBus,
	}
}

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	r.Body.Close()

	var a any.Any
	if err := proto.Unmarshal(b, &a); err != nil {
		return err
	}

	trace.AddField(ctx, "task.type_url", a.TypeUrl)

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
		return err
	}

	trace.AddField(ctx, "task.type", fmt.Sprintf("%T", msg.Message))

	switch task := msg.Message.(type) {
	case *tweets.PostTweetTask:
		_, err = h.commandBus.Run(ctx, writetweets.PostCommand{
			UserID:   task.UserId,
			TweetID:  tweets.TweetID(task.TweetId),
			Autopost: task.Autopost,
		})
	default:
		err = fmt.Errorf("unknown task type %T", msg.Message)
	}

	return err
}