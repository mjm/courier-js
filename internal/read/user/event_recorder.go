package user

import (
	"context"
	"reflect"

	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/user/queries"
	"github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type EventRecorder struct {
	db db.DB
}

func NewEventRecorder(db db.DB, events event.Source) *EventRecorder {
	r := &EventRecorder{
		db: db,
	}
	events.Notify(r)
	return r
}

func (r *EventRecorder) HandleEvent(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "EventRecorder.HandleEvent",
		trace.WithAttributes(internalTypeKey(reflect.TypeOf(evt).String())))
	defer span.End()

	switch evt := evt.(type) {

	case feeds.FeedSubscribed:
		r.record(ctx, evt.UserId, FeedSubscribe, EventParams{
			FeedID:             evt.FeedId,
			FeedSubscriptionID: evt.FeedSubscriptionId,
		})

	case feeds.FeedRefreshed:
		r.record(ctx, evt.UserId, FeedRefresh, EventParams{
			FeedID: evt.FeedId,
			// TODO fetch subscription from user ID
		})

	case feeds.FeedOptionsChanged:
		r.record(ctx, evt.UserId, FeedSetAutopost, EventParams{
			FeedSubscriptionID: evt.FeedSubscriptionId,
			ParamValue:         &evt.Autopost,
		})

	case feeds.FeedUnsubscribed:
		r.record(ctx, evt.UserId, FeedUnsubscribe, EventParams{
			FeedSubscriptionID: evt.FeedSubscriptionId,
		})

	case tweets.TweetCanceled:
		r.record(ctx, evt.UserId, TweetCancel, EventParams{
			TweetID: evt.TweetId,
		})

	case tweets.TweetUncanceled:
		r.record(ctx, evt.UserId, TweetUncancel, EventParams{
			TweetID: evt.TweetId,
		})

	case tweets.TweetEdited:
		r.record(ctx, evt.UserId, TweetEdit, EventParams{
			TweetID: evt.TweetId,
		})

	case tweets.TweetPosted:
		t := TweetPost
		if evt.Autoposted {
			t = TweetAutopost
		}
		r.record(ctx, evt.UserId, t, EventParams{
			TweetID: evt.TweetId,
		})

	case billing.SubscriptionCreated:
		r.record(ctx, evt.UserId, SubscriptionCreate, EventParams{
			SubscriptionID: evt.SubscriptionId,
		})

	case billing.SubscriptionRenewed:
		r.record(ctx, evt.UserId, SubscriptionRenew, EventParams{
			SubscriptionID: evt.SubscriptionId,
		})

	case billing.SubscriptionCanceled:
		r.record(ctx, evt.UserId, SubscriptionCancel, EventParams{
			SubscriptionID: evt.SubscriptionId,
		})

	case billing.SubscriptionReactivated:
		r.record(ctx, evt.UserId, SubscriptionReactivate, EventParams{
			SubscriptionID: evt.SubscriptionId,
		})

	case billing.SubscriptionExpired:
		r.record(ctx, evt.UserId, SubscriptionExpire, EventParams{
			SubscriptionID: evt.SubscriptionId,
		})

	}
}

func (r *EventRecorder) record(ctx context.Context, userID string, t EventType, p EventParams) {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(userID),
		externalTypeKey(string(t)))

	if _, err := r.db.ExecContext(ctx, queries.EventsRecord, userID, t, p); err != nil {
		span.RecordError(ctx, err)
	}
}
