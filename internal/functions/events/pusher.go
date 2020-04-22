package events

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"github.com/mjm/graphql-go/relay"
	"github.com/pusher/pusher-http-go"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/functions/events")

type Pusher struct {
	client *pusher.Client
}

func NewPusher(events event.Source, client *pusher.Client) *Pusher {
	p := &Pusher{
		client: client,
	}

	events.Notify(p)
	return p
}

func (p *Pusher) HandleEvent(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "Pusher.HandleEvent")
	defer span.End()

	var pushed bool
	defer func() {
		span.SetAttributes(key.Bool("event.pushed", pushed))
	}()

	t := reflect.TypeOf(evt)
	eventName := t.Name()
	span.SetAttributes(key.String("event.name", eventName))

	// for now, only send events when a user ID matches
	userIDField := reflect.ValueOf(evt).FieldByName("UserId")
	if userIDField.Kind() == reflect.Invalid {
		return
	}
	userID := userIDField.String()
	if userID == "" {
		return
	}

	span.SetAttributes(keys.UserID(userID))

	channelName := fmt.Sprintf("private-events-%s", strings.ReplaceAll(userID, "|", "_"))
	span.SetAttributes(key.String("event.channel_name", channelName))

	evt = convertIDsToGraphQL(evt)

	if err := p.client.Trigger(channelName, eventName, evt); err != nil {
		span.RecordError(ctx, err)
		return
	}

	pushed = true
}

var fieldsToNodeKind = map[string]string{
	"FeedId":  resolvers.FeedNode,
	"PostId":  resolvers.PostNode,
	"TweetId": resolvers.TweetNode,
}

func convertIDsToGraphQL(evt interface{}) interface{} {
	v := reflect.ValueOf(evt)
	ptr := reflect.PtrTo(v.Type())
	pv := reflect.New(ptr.Elem())
	pv.Elem().Set(v)
	v = pv.Elem()

	for i := 0; i < v.NumField(); i++ {
		fieldName := v.Type().Field(i).Name
		nodeType, ok := fieldsToNodeKind[fieldName]
		if !ok {
			continue
		}

		id := relay.MarshalID(nodeType, fmt.Sprintf("%s", v.Field(i)))
		v.Field(i).SetString(string(id))
	}

	return pv.Elem().Interface()
}
