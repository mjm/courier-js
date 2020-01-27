package tweet

import (
	"context"
	"strconv"

	"github.com/graph-gophers/dataloader"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
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
	loaderFn := func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		userID, err := auth.GetUser(ctx).MustID()
		if err != nil {
			return nil
		}

		rows, err := db.QueryxContext(ctx, userTweetsQuery, userID, loader.IntArray(keys))
		var tweet Tweet
		return loader.Gather(keys, rows, &tweet, func(tweet interface{}) string {
			return strconv.Itoa(tweet.(*Tweet).ID)
		})
	}
	return Loader{
		dataloader.NewBatchedLoader(loaderFn, dataloader.WithTracer(trace.DataloaderTracer{
			Label: "Tweet Loader",
		})),
	}
}
