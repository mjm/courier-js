package user

import (
	"context"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/pager"
)

// EventQueries is an interface for reading information about user events.
type EventQueries interface {
	// Paged fetches a paged subset of a user's events.
	Paged(context.Context, string, pager.Options) (*pager.Connection, error)
}

type eventQueries struct {
	db db.DB
}

// NewEventQueries returns queries targeting a given database.
func NewEventQueries(db db.DB) EventQueries {
	return &eventQueries{db: db}
}

func (q *eventQueries) Paged(ctx context.Context, userID string, opts pager.Options) (*pager.Connection, error) {
	return pager.Paged(ctx, q.db, &eventPager{UserID: userID}, opts)
}
