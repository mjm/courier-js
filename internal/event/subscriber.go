package event

import (
	"context"
	"fmt"
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
	client *pubsub.Client
	topic  *pubsub.Topic
	sub    *pubsub.Subscription

	subscribers map[reflect.Type]map[chan<- interface{}]struct{}

	mu sync.Mutex
}

func NewSubscriber(cfg PublisherConfig, client *pubsub.Client) *Subscriber {
	topic := client.Topic(cfg.TopicID)

	return &Subscriber{
		client:      client,
		topic:       topic,
		subscribers: make(map[reflect.Type]map[chan<- interface{}]struct{}),
	}
}

func (s *Subscriber) Subscribe(ctx context.Context, v interface{}) (<-chan interface{}, error) {
	if err := s.ensureSubscription(); err != nil {
		return nil, err
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	ch := make(chan interface{})

	t := reflect.TypeOf(v)
	subs, ok := s.subscribers[t]
	if !ok {
		subs = make(map[chan<- interface{}]struct{})
		s.subscribers[t] = subs
	}

	subs[ch] = struct{}{}

	// watch for the context to be done, and close the channel and remove it from the
	// subscribers
	go func() {
		<-ctx.Done()
		s.mu.Lock()
		defer s.mu.Unlock()

		close(ch)
		delete(s.subscribers[t], ch)
	}()

	return ch, nil
}

func (s *Subscriber) send(ctx context.Context, evt interface{}) {
	s.mu.Lock()
	defer s.mu.Unlock()

	t := reflect.TypeOf(evt)
	for ch := range s.subscribers[t] {
		ch <- evt
	}
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
			s.send(ctx, reflect.ValueOf(msg.Message).Elem().Interface())
			message.Ack()
		}); err != nil {
			fmt.Printf("error listening for events: %v", err)
		}
	}()

	return nil
}
