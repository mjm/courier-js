package user

import (
	"context"
	"reflect"
	"strconv"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/feedevent"
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
		feedevent.FeedRefreshed{})
	return r
}

func (r *EventRecorder) Handle(ctx context.Context, evt interface{}) {
	ctx = trace.Start(ctx, "Record event")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "event.type_internal", reflect.TypeOf(evt).String())

	switch evt := evt.(type) {

	case feedevent.FeedSubscribed:
		r.record(ctx, evt.UserID, FeedSubscribe, EventParams{
			FeedID:             strconv.Itoa(evt.FeedID),
			FeedSubscriptionID: strconv.Itoa(evt.SubscriptionID),
		})

	case feedevent.FeedRefreshed:
		r.record(ctx, evt.UserID, FeedRefresh, EventParams{
			FeedID: strconv.Itoa(evt.FeedID),
			// TODO fetch subscription from user ID
		})

	}
}

func (r *EventRecorder) record(ctx context.Context, userID string, t EventType, p EventParams) error {
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
		return err
	}

	return nil
}
