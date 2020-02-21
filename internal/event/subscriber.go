package event

import (
	"context"
	"fmt"
	"log"
	"reflect"
	"sync"
	"time"

	"cloud.google.com/go/pubsub"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"
	"github.com/google/uuid"
	"github.com/google/wire"
)

var SubscribingSet = wire.NewSet(NewBus, NewPublisherConfig, NewPubSubClient, NewSubscriber)

type Subscriber struct {
	*Bus

	client *pubsub.Client
	topic  *pubsub.Topic
	sub    *pubsub.Subscription

	mu sync.Mutex
}

func NewSubscriber(cfg PublisherConfig, client *pubsub.Client) *Subscriber {
	topic := client.Topic(cfg.TopicID)
	// create a local bus here so that we don't broadcast to a bunch of handlers that are only
	// expecting to handle local events. need to refactor that later such that event handlers
	// are only running in the events function or on subscribe requests from graphql.
	bus := NewBus()

	return &Subscriber{
		Bus:    bus,
		client: client,
		topic:  topic,
	}
}

func (s *Subscriber) Notify(h Handler, v ...interface{}) {
	if err := s.ensureSubscription(); err != nil {
		log.Printf("error setting up subscription: %v", err)
		return
	}

	s.Bus.Notify(h, v...)
}

func (s *Subscriber) ensureSubscription() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.sub != nil {
		return nil
	}

	ctx := context.Background()

	var err error
	subID := "events-" + uuid.New().String()
	s.sub, err = s.client.CreateSubscription(ctx, subID, pubsub.SubscriptionConfig{
		Topic:            s.topic,
		ExpirationPolicy: 24 * time.Hour,
	})
	if err != nil {
		return err
	}

	go func() {
		if err := s.sub.Receive(ctx, func(ctx context.Context, message *pubsub.Message) {
			fmt.Println("got an event")
			var a any.Any
			if err := proto.Unmarshal(message.Data, &a); err != nil {
				message.Nack()
				return
			}

			var msg ptypes.DynamicAny
			if err := ptypes.UnmarshalAny(&a, &msg); err != nil {
				message.Nack()
				return
			}

			fmt.Println("firing an event")
			s.Fire(ctx, reflect.ValueOf(msg.Message).Elem().Interface())
			message.Ack()
		}); err != nil {
			fmt.Printf("error listening for events: %v", err)
		}
	}()

	return nil
}
