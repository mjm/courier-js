package user

import (
	"context"
	"reflect"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/event/tweetevent"
	"github.com/mjm/courier-js/internal/trace"
)

type EventRecorder struct {
	db db.DB
}

func NewEventRecorder(db db.DB, eventBus *event.Bus) *EventRecorder {
	r := &EventRecorder{
		db: db,
	}
	eventBus.Notify(r,
		feedevent.FeedSubscribed{},
		feedevent.FeedRefreshed{},
		feedevent.FeedOptionsChanged{},
		feedevent.FeedUnsubscribed{},
		tweetevent.TweetCanceled{},
		tweetevent.TweetUncanceled{},
	)
	return r
}

func (r *EventRecorder) HandleEvent(ctx context.Context, evt interface{}) {
	ctx = trace.Start(ctx, "Record event")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "event.type_internal", reflect.TypeOf(evt).String())

	switch evt := evt.(type) {

	case feedevent.FeedSubscribed:
		r.record(ctx, evt.UserID, FeedSubscribe, EventParams{
			FeedID:             evt.FeedID,
			FeedSubscriptionID: evt.SubscriptionID,
		})

	case feedevent.FeedRefreshed:
		r.record(ctx, evt.UserID, FeedRefresh, EventParams{
			FeedID: evt.FeedID,
			// TODO fetch subscription from user ID
		})

	case feedevent.FeedOptionsChanged:
		r.record(ctx, evt.UserID, FeedSetAutopost, EventParams{
			FeedSubscriptionID: evt.SubscriptionID,
			ParamValue:         &evt.Autopost,
		})

	case feedevent.FeedUnsubscribed:
		r.record(ctx, evt.UserID, FeedUnsubscribe, EventParams{
			FeedSubscriptionID: evt.SubscriptionID,
		})

	case tweetevent.TweetCanceled:
		r.record(ctx, evt.UserID, TweetCancel, EventParams{
			TweetID: evt.TweetID,
		})

	case tweetevent.TweetUncanceled:
		r.record(ctx, evt.UserID, TweetUncancel, EventParams{
			TweetID: evt.TweetID,
		})

	}
}

func (r *EventRecorder) record(ctx context.Context, userID string, t EventType, p EventParams) {
	trace.Add(ctx, trace.Fields{
		"event.type_external": string(t),
		"event.user_id":       userID,
	})

	if _, err := r.db.ExecContext(ctx, `
		INSERT INTO events (
			user_id, event_type, parameters
		) VALUES (
			$1, $2, $3
		)
	`, userID, t, p); err != nil {
		trace.Error(ctx, err)
	}
}
