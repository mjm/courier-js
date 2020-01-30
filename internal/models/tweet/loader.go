package tweet

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
)

// Loader loads one or more tweets by ID.
type Loader struct {
	*dataloader.Loader
}

const userTweetsQuery = `
SELECT tweets.*
	FROM tweets
	JOIN feed_subscriptions
		ON tweets.feed_subscription_id = feed_subscriptions.id
 WHERE feed_subscriptions.user_id = $1
   AND tweets.id = ANY($2)
`

func NewLoader(db *db.DB) Loader {
	return Loader{
		loader.New("Tweet Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			userID, err := auth.GetUser(ctx).ID()
			if err != nil {
				return nil
			}

			rows, err := db.QueryxContext(ctx, userTweetsQuery, userID, loader.IntArray(keys))
			return loader.Gather(keys, rows, func(rows *sqlx.Rows) (interface{}, string, error) {
				var tweet Tweet
				if err := rows.StructScan(&tweet); err != nil {
					return nil, "", err
				}

				return &tweet, strconv.Itoa(tweet.ID), nil
			})
		}),
	}
}
