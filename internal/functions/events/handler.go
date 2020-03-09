package events

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"

	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/tweets"
	user2 "github.com/mjm/courier-js/internal/write/user"
)

type Handler struct {
	bus *event.Bus
}

func NewHandler(
	traceCfg trace.Config,
	bus *event.Bus,
	_ *user.EventRecorder,
	_ *Pusher,
	_ *notifications.Notifier,
	_ *tweets.EventHandler,
	_ *user2.EventHandler,
) *Handler {
	trace.Init(traceCfg)

	return &Handler{bus: bus}
}

type PubSubMessage struct {
	Message struct {
		Data []byte `json:"data,omitempty"`
		ID   string `json:"id"`
	}
	Subscription string `json:"subscription"`
}

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	var message PubSubMessage
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		return err
	}

	var a any.Any
	if err := proto.Unmarshal(message.Message.Data, &a); err != nil {
		return err
	}

	trace.AddField(ctx, "event.type_url", a.TypeUrl)

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
		return err
	}

	trace.AddField(ctx, "event.type", fmt.Sprintf("%T", msg.Message))

	h.bus.Fire(ctx, reflect.ValueOf(msg.Message).Elem().Interface())
	return nil
}
