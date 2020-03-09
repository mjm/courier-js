package events

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"github.com/mjm/graphql-go/relay"
	"github.com/pusher/pusher-http-go"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/resolvers"
	"github.com/mjm/courier-js/internal/trace"
)

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
	ctx = trace.Start(ctx, "Push event")
	defer trace.Finish(ctx)

	var pushed bool
	defer func() {
		trace.AddField(ctx, "event.pushed", pushed)
	}()

	t := reflect.TypeOf(evt)
	eventName := t.Name()
	trace.AddField(ctx, "event.name", eventName)

	// for now, only send events when a user ID matches
	userID := reflect.ValueOf(evt).FieldByName("UserId").String()
	if userID == "" {
		return
	}

	trace.UserID(ctx, userID)

	channelName := fmt.Sprintf("private-events-%s", strings.ReplaceAll(userID, "|", "_"))
	trace.AddField(ctx, "event.channel_name", channelName)

	evt = convertIDsToGraphQL(evt)

	if err := p.client.Trigger(channelName, eventName, evt); err != nil {
		trace.Error(ctx, err)
		return
	}

	pushed = true
}

var fieldsToNodeKind = map[string]string{
	"FeedId":             resolvers.FeedNode,
	"FeedSubscriptionId": resolvers.SubscribedFeedNode,
	"PostId":             resolvers.PostNode,
	"TweetId":            resolvers.TweetNode,
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
