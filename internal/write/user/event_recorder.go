package user

import (
	"context"
	"reflect"

	"github.com/jonboulle/clockwork"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
)

var (
	internalTypeKey = kv.Key("event.type_internal").String
	externalTypeKey = kv.Key("event.type_external").String
)

type EventRecorder struct {
	eventRepo *shared.EventRepository
	clock     clockwork.Clock
}

func NewEventRecorder(eventRepo *shared.EventRepository, clock clockwork.Clock, events event.Source) *EventRecorder {
	r := &EventRecorder{
		eventRepo: eventRepo,
		clock:     clock,
	}
	events.Notify(r)
	return r
}

func (r *EventRecorder) HandleEvent(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "EventRecorder.HandleEvent",
		trace.WithAttributes(internalTypeKey(reflect.TypeOf(evt).String())))
	defer span.End()

	e := &model.Event{
		ID: model.NewEventID(),
	}

	switch evt := evt.(type) {

	case feeds.FeedSubscribed:
		e.UserID = evt.UserId
		e.EventType = model.FeedSubscribe
		e.Feed = &model.EventFeedInfo{
			ID: model.FeedID(evt.FeedId),
		}

	case feeds.FeedRefreshed:
		e.UserID = evt.UserId
		e.EventType = model.FeedRefresh
		e.Feed = &model.EventFeedInfo{
			ID: model.FeedID(evt.FeedId),
		}

	case feeds.FeedOptionsChanged:
		e.UserID = evt.UserId
		e.EventType = model.FeedSetAutopost
		e.Feed = &model.EventFeedInfo{
			ID:       model.FeedID(evt.FeedId),
			Autopost: &evt.Autopost,
		}

	case feeds.FeedUnsubscribed:
		e.UserID = evt.UserId
		e.EventType = model.FeedUnsubscribe
		e.Feed = &model.EventFeedInfo{
			ID: model.FeedID(evt.FeedId),
		}

	case tweets.TweetCanceled:
		e.UserID = evt.UserId
		e.EventType = model.TweetCancel
		e.TweetGroup = &model.EventTweetInfo{
			ID: model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.ItemId),
		}

	case tweets.TweetUncanceled:
		e.UserID = evt.UserId
		e.EventType = model.TweetUncancel
		e.TweetGroup = &model.EventTweetInfo{
			ID: model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.ItemId),
		}

	case tweets.TweetEdited:
		e.UserID = evt.UserId
		e.EventType = model.TweetEdit
		e.TweetGroup = &model.EventTweetInfo{
			ID: model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.ItemId),
		}

	case tweets.TweetPosted:
		e.UserID = evt.UserId
		if evt.Autoposted {
			e.EventType = model.TweetAutopost
		} else {
			e.EventType = model.TweetPost
		}
		e.TweetGroup = &model.EventTweetInfo{
			ID: model.TweetGroupIDFromParts(evt.UserId, model.FeedID(evt.FeedId), evt.ItemId),
		}

	case billing.SubscriptionCreated:
		e.UserID = evt.UserId
		e.EventType = model.SubscriptionCreate
		e.SubscriptionID = evt.SubscriptionId

	case billing.SubscriptionRenewed:
		e.UserID = evt.UserId
		e.EventType = model.SubscriptionRenew
		e.SubscriptionID = evt.SubscriptionId

	case billing.SubscriptionCanceled:
		e.UserID = evt.UserId
		e.EventType = model.SubscriptionCancel
		e.SubscriptionID = evt.SubscriptionId

	case billing.SubscriptionReactivated:
		e.UserID = evt.UserId
		e.EventType = model.SubscriptionReactivate
		e.SubscriptionID = evt.SubscriptionId

	case billing.SubscriptionExpired:
		e.UserID = evt.UserId
		e.EventType = model.SubscriptionExpire
		e.SubscriptionID = evt.SubscriptionId

	}

	span.SetAttributes(
		keys.UserID(e.UserID),
		externalTypeKey(string(e.EventType)))

	if e.EventType == "" || e.UserID == "" {
		return
	}

	if err := r.eventRepo.Create(ctx, e); err != nil {
		span.RecordError(ctx, err)
	}
}
