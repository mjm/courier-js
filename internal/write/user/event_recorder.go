package user

import (
	"context"
	"reflect"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
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
		// feeds.FeedSubscribed{},
		// feeds.FeedRefreshed{},
		// feeds.FeedOptionsChanged{},
		// feeds.FeedUnsubscribed{},
		tweets.TweetCanceled{},
		tweets.TweetUncanceled{},
		tweets.TweetEdited{},
	)
	return r
}

func (r *EventRecorder) HandleEvent(ctx context.Context, evt interface{}) {
	ctx = trace.Start(ctx, "Record event")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "event.type_internal", reflect.TypeOf(evt).String())

	switch evt := evt.(type) {

	case feeds.FeedSubscribed:
		r.record(ctx, evt.UserId, FeedSubscribe, EventParams{
			FeedID:             evt.FeedId,
			FeedSubscriptionID: evt.SubscriptionId,
		})

	case feeds.FeedRefreshed:
		r.record(ctx, evt.UserId, FeedRefresh, EventParams{
			FeedID: evt.FeedId,
			// TODO fetch subscription from user ID
		})

	case feeds.FeedOptionsChanged:
		r.record(ctx, evt.UserId, FeedSetAutopost, EventParams{
			FeedSubscriptionID: evt.SubscriptionId,
			ParamValue:         &evt.Autopost,
		})

	case feeds.FeedUnsubscribed:
		r.record(ctx, evt.UserId, FeedUnsubscribe, EventParams{
			FeedSubscriptionID: evt.SubscriptionId,
		})

	case tweets.TweetCanceled:
		r.record(ctx, evt.UserID, TweetCancel, EventParams{
			TweetID: string(evt.TweetID),
		})

	case tweets.TweetUncanceled:
		r.record(ctx, evt.UserID, TweetUncancel, EventParams{
			TweetID: string(evt.TweetID),
		})

	case tweets.TweetEdited:
		r.record(ctx, evt.UserID, TweetEdit, EventParams{
			TweetID: string(evt.TweetID),
		})

	}
}

func (r *EventRecorder) record(ctx context.Context, userID string, t EventType, p EventParams) {
	trace.UserID(ctx, userID)
	trace.Add(ctx, trace.Fields{
		"event.type_external": string(t),
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
