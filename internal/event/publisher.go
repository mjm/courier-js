package event

import (
	"context"
	"reflect"

	"cloud.google.com/go/pubsub"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/config"
)

var PublishingSet = wire.NewSet(wire.Bind(new(Sink), new(*Publisher)), NewPubSubClient, NewPublisher, NewPublisherConfig)

type PublisherConfig struct {
	TopicID string `env:"GCP_TOPIC_ID"`
}

func NewPublisherConfig(l *config.Loader) (cfg PublisherConfig, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

type Publisher struct {
	topic *pubsub.Topic
}

func NewPublisher(cfg PublisherConfig, client *pubsub.Client) *Publisher {
	t := client.Topic(cfg.TopicID)

	return &Publisher{
		topic: t,
	}
}

func (p *Publisher) Fire(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "Publisher.Fire",
		trace.WithSpanKind(trace.SpanKindProducer),
		trace.WithAttributes(
			typeKey(reflect.TypeOf(evt).String()),
			key.String("messaging.system", "google_cloud_pubsub"),
			key.String("messaging.operation", "send"),
			key.String("messaging.destination_kind", "topic"),
			key.String("messaging.destination", p.topic.ID())))
	defer span.End()

	evtPtr := reflect.New(reflect.TypeOf(evt))
	evtPtr.Elem().Set(reflect.ValueOf(evt))

	evtMsg, ok := evtPtr.Interface().(proto.Message)
	if !ok {
		span.SetAttributes(isProtoKey(false))
		return
	}

	span.SetAttributes(isProtoKey(true))

	a, err := ptypes.MarshalAny(evtMsg)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	data, err := proto.Marshal(a)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(dataLenKey(len(data)))

	sc := span.SpanContext()

	msg := &pubsub.Message{
		Data: data,
		Attributes: map[string]string{
			"trace_id": sc.TraceIDString(),
			"span_id":  sc.SpanIDString(),
		},
	}
	res := p.topic.Publish(ctx, msg)
	id, err := res.Get(ctx)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	span.SetAttributes(
		publishedIDKey(id),
		key.String("messaging.message_id", id))
}
