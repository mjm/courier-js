package event

import (
	"context"
	"os"
	"reflect"

	"cloud.google.com/go/pubsub"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

var PublishingSet = wire.NewSet(NewBus, NewPubSubClient, NewPublisher, NewPublisherConfig)

type PublisherConfig struct {
	secret.GCPConfig
	TopicID string
}

type Publisher struct {
	topic *pubsub.Topic
	bus   *Bus
}

func NewPublisher(cfg PublisherConfig, client *pubsub.Client, bus *Bus) *Publisher {
	t := client.Topic(cfg.TopicID)

	p := &Publisher{
		topic: t,
		bus:   bus,
	}
	bus.NotifyAll(p)
	return p
}

func NewPublisherConfig(secretConfig secret.GCPConfig) PublisherConfig {
	return PublisherConfig{
		GCPConfig: secretConfig,
		TopicID:   os.Getenv("GCP_TOPIC_ID"),
	}
}

func (p *Publisher) HandleEvent(ctx context.Context, evt interface{}) {
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
	}
	res := p.topic.Publish(ctx, msg)
	id, err := res.Get(ctx)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	trace.AddField(ctx, "event.published_id", id)
}
