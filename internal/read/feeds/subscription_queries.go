package feeds

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/pager"
)

// SubscriptionQueries is an interface for reading information about a user's subscribed feeds.
type SubscriptionQueries interface {
	// Get fetches a feed subscription by ID.
	Get(context.Context, int) (*Subscription, error)
	// GetEdge fetches a pager edge for a feed subscription by ID.
	GetEdge(context.Context, int) (pager.Edge, error)
}

type subscriptionQueries struct {
	db     db.DB
	loader *dataloader.Loader
}

// NewSubscriptionQueries returns queries targeting a given database and event bus.
// The event bus is used to invalidate cached data when the write model makes changes.
func NewSubscriptionQueries(db db.DB, eventBus *event.Bus) SubscriptionQueries {
	q := &subscriptionQueries{
		db:     db,
		loader: newSubscriptionLoader(db),
	}
	eventBus.Notify(q, feedevent.FeedSubscribed{})
	return q
}

const subscriptionLoaderQuery = `
	SELECT
		*
	FROM
		feed_subscriptions
	WHERE user_id = $1
		AND discarded_at IS NULL
		AND id = ANY($2)
`

func newSubscriptionLoader(db db.DB) *dataloader.Loader {
	return loader.New("Feed Subscription Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		userID, err := auth.GetUser(ctx).ID()
		if err != nil {
			return nil
		}

		rows, err := db.QueryxContext(ctx, subscriptionLoaderQuery, userID, loader.IntArray(keys))
		if err != nil {
			panic(err)
		}
		return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
			var sub Subscription
			if err := rows.StructScan(&sub); err != nil {
				return nil, "", err
			}

			return &sub, strconv.Itoa(sub.ID), nil
		})
	})
}

func (q *subscriptionQueries) Get(ctx context.Context, id int) (*Subscription, error) {
	v, err := q.loader.Load(ctx, loader.IntKey(id))()
	if err != nil {
		return nil, err
	}
	return v.(*Subscription), nil
}

func (q *subscriptionQueries) GetEdge(ctx context.Context, id int) (pager.Edge, error) {
	var row struct {
		Subscription
		URL string `db:"url"`
	}
	if err := q.db.QueryRowxContext(ctx, `
		SELECT
			feed_subscriptions.*,
			feeds.url
		FROM
			feed_subscriptions
			JOIN feeds ON feed_subscriptions.feed_id = feeds.id
		WHERE
			feed_subscriptions.id = $1
	`, id).StructScan(&row); err != nil {
		return pager.Edge{}, nil
	}

	return pager.Edge{
		Node:   &row.Subscription,
		Cursor: pager.Cursor(row.URL),
	}, nil
}

func (q *subscriptionQueries) Handle(ctx context.Context, evt interface{}) {
	switch evt := evt.(type) {

	case feedevent.FeedSubscribed:
		q.loader.Clear(ctx, loader.IntKey(evt.SubscriptionID))

	}
}
