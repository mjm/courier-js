package events

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"reflect"

	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/propagation"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/notifications"
	"github.com/mjm/courier-js/internal/write/tweets"
	"github.com/mjm/courier-js/internal/write/user"
)

type Handler struct {
	bus *event.Bus
}

func NewHandler(
	bus *event.Bus,
	_ *user.EventRecorder,
	_ *Pusher,
	_ *notifications.Notifier,
	_ *tweets.EventHandler,
	_ *user.EventHandler,
) *Handler {
	return &Handler{bus: bus}
}

type PubSubPayload struct {
	Message      Message `json:"message"`
	Subscription string  `json:"subscription"`
}

type Message struct {
	Data       []byte            `json:"data,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
	ID         string            `json:"id"`
}

func (h *Handler) Extract(r *http.Request, _ propagation.Propagators) (context.Context, error) {
	payload, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}

	r.Body = ioutil.NopCloser(bytes.NewReader(payload))

	var message PubSubPayload
	if err := json.Unmarshal(payload, &message); err != nil {
		return nil, err
	}

	var sc core.SpanContext

	sc.TraceID, err = core.TraceIDFromHex(message.Message.Attributes["trace_id"])
	if err != nil {
		return nil, err
	}

	sc.SpanID, err = core.SpanIDFromHex(message.Message.Attributes["span_id"])
	if err != nil {
		return nil, err
	}

	return trace.ContextWithRemoteSpanContext(r.Context(), sc), nil
}

func (h *Handler) HandleHTTP(ctx context.Context, _ http.ResponseWriter, r *http.Request) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		key.String("messaging.system", "google_cloud_pubsub"),
		key.String("messaging.destination_kind", "topic"),
		key.String("messaging.operation", "process"))

	var message PubSubPayload
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		return err
	}

	span.SetAttributes(
		key.String("messaging.message_id", message.Message.ID),
		key.String("messaging.destination", message.Subscription))

	var a any.Any
	if err := proto.Unmarshal(message.Message.Data, &a); err != nil {
		return err
	}

	span.SetAttributes(key.String("event.type_url", a.TypeUrl))

	var msg ptypes.DynamicAny
	if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
		return err
	}

	span.SetAttributes(key.String("event.type", fmt.Sprintf("%T", msg.Message)))

	h.bus.Fire(ctx, reflect.ValueOf(msg.Message).Elem().Interface())
	return nil
}
