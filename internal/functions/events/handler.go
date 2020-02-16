package events

import (
	"context"
	"fmt"
	"reflect"

	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/user"
	"github.com/mjm/courier-js/internal/trace"
)

type PubSubHandler struct {
	bus *event.Bus
}

func NewPubSubHandler(traceCfg trace.Config, bus *event.Bus, _ *user.EventRecorder) *PubSubHandler {
	trace.Init(traceCfg)

	return &PubSubHandler{bus: bus}
}

type PubSubEvent struct {
	Data []byte `json:"data"`
}

func (h *PubSubHandler) HandleEvent(ctx context.Context, event PubSubEvent) error {
	defer trace.Flush()

	ctx = trace.Start(ctx, "PubSub event")
	defer trace.Finish(ctx)

	var a any.Any
	if err := proto.Unmarshal(event.Data, &a); err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.AddField(ctx, "event.type_url", a.TypeUrl)

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.AddField(ctx, "event.type", fmt.Sprintf("%T", msg.Message))

	h.bus.Fire(ctx, reflect.ValueOf(msg.Message).Elem().Interface())

	return nil
}
