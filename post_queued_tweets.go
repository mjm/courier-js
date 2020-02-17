package courier

import (
	"context"
	"sync"

	"github.com/mjm/courier-js/internal/functions/postqueued"
	"github.com/mjm/courier-js/internal/trace"
)

var initPostQueuedTweets sync.Once
var postQueuedTweets *postqueued.Handler

func PostQueuedTweets(ctx context.Context, e interface{}) error {
	initPostQueuedTweets.Do(func() {
		var err error
		postQueuedTweets, err = postqueued.InitializeHandler(secretConfig)
		if err != nil {
			panic(err)
		}

		trace.SetServiceName("post_queued_tweets")
	})

	return postQueuedTweets.HandleEvent(ctx, e)
}
