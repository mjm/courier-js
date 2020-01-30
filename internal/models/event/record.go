package event

import (
	"context"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/trace"
)

const createEventQuery = `
	INSERT INTO events (
		user_id,
		event_type,
		parameters
	) VALUES (
		$1, $2, $3
	)
`

// Record creates a new event for the current user.
func Record(ctx context.Context, db *db.DB, t Type, p Params) error {
	userID, _ := auth.GetUser(ctx).ID()
	return RecordAs(ctx, db, userID, t, p)
}

// RecordAs creates a new event for a particular user. This is useful for background
// requests that don't have the user's token for auth, like billing events or autoposting.
func RecordAs(ctx context.Context, db *db.DB, userID string, t Type, p Params) error {
	ctx = trace.Start(ctx, "Record event")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"event.user_id": userID,
		"event.type":    string(t),
	})

	_, err := db.ExecContext(ctx, createEventQuery, userID, t, p)
	if err != nil {
		trace.Error(ctx, err)
	}
	return err
}
