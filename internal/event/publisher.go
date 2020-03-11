package event

import (
	"context"
	"reflect"

	"cloud.google.com/go/pubsub"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/trace"
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
	ctx = trace.Start(ctx, "Publish event")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "event.type", reflect.TypeOf(evt).String())

	evtPtr := reflect.New(reflect.TypeOf(evt))
	evtPtr.Elem().Set(reflect.ValueOf(evt))

	evtMsg, ok := evtPtr.Interface().(proto.Message)
	if !ok {
		trace.AddField(ctx, "event.is_proto", false)
		return
	}

	trace.AddField(ctx, "event.is_proto", true)

	a, err := ptypes.MarshalAny(evtMsg)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	data, err := proto.Marshal(a)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	trace.AddField(ctx, "event.data_length", len(data))

	msg := &pubsub.Message{
		Data: data,
		Attributes: map[string]string{
			"trace_id": trace.GetTraceID(ctx),
			"span_id":  trace.GetSpanID(ctx),
		},
	}
	res := p.topic.Publish(ctx, msg)
	id, err := res.Get(ctx)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	trace.AddField(ctx, "event.published_id", id)
}
