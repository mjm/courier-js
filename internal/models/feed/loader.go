package feed

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"
	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
)

type Loader struct {
	*dataloader.Loader
}

const feedsQuery = `SELECT * FROM feeds WHERE id = ANY($1)`

func NewLoader(db db.DB) Loader {
	return Loader{
		loader.New("Feed Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			rows, _ := db.QueryxContext(ctx, feedsQuery, loader.IntArray(keys))
			return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
				var feed Feed
				if err := rows.StructScan(&feed); err != nil {
					return nil, "", err
				}

				return &feed, strconv.Itoa(feed.ID), nil
			})
		}),
	}
}

type SubscriptionLoader struct {
	*dataloader.Loader
}

const subscriptionsQuery = `
	SELECT
		*
	FROM
		feed_subscriptions
	WHERE user_id = $1
		AND discarded_at IS NULL
		AND id = ANY($2)
`

func NewSubscriptionLoader(db db.DB) SubscriptionLoader {
	return SubscriptionLoader{
		loader.New("Feed Subscription Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			userID, err := auth.GetUser(ctx).ID()
			if err != nil {
				return nil
			}

			rows, err := db.QueryxContext(ctx, subscriptionsQuery, userID, loader.IntArray(keys))
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
		}),
	}
}
