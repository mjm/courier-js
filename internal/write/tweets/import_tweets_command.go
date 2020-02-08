package tweets

import (
	"context"
	"sync"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/trace"
	"golang.org/x/sync/errgroup"
)

// ImportTweetsCommand represents a request to create or update tweets in a subscription
// to match some posts that were imported.
type ImportTweetsCommand struct {
	Subscription *FeedSubscription
	Posts        []*Post
}

func (h *CommandHandler) handleImportTweets(ctx context.Context, cmd ImportTweetsCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":              cmd.Subscription.UserID,
		"feed.id":              cmd.Subscription.FeedID,
		"feed.subscription_id": cmd.Subscription.ID,
		"feed.autopost":        cmd.Subscription.Autopost,
		"import.post_count":    len(cmd.Posts),
	})

	var postIDs []int
	for _, p := range cmd.Posts {
		postIDs = append(postIDs, p.ID)
	}

	tweetsByPost, err := h.tweetRepo.ByPostIDs(ctx, cmd.Subscription.ID, postIDs)
	if err != nil {
		return err
	}

	wg, subCtx := errgroup.WithContext(ctx)
	var toCreate []interface{}
	var lock sync.Mutex

	for _, post := range cmd.Posts {
		post := post
		tweets := tweetsByPost[post.ID]

		wg.Go(func() error {
			newTweets, err := h.planTweets(subCtx, post, tweets)
			if err != nil {
				return err
			}

			lock.Lock()
			defer lock.Unlock()
			toCreate = append(toCreate, newTweets...)
			return nil
		})
	}

	if err := wg.Wait(); err != nil {
		return err
	}

	return nil
}

func (h *CommandHandler) planTweets(ctx context.Context, post *Post, tweets []*Tweet) ([]interface{}, error) {
	ctx = trace.Start(ctx, "Plan tweets")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"post.id":              post.ID,
		"existing_tweet_count": len(tweets),
	})

	// TODO translate tweets from HTML

	return nil, nil
}

func (h *CommandHandler) handlePostsImported(ctx context.Context, evt feedevent.PostsImported) {
	subs, err := h.subRepo.ByFeedID(ctx, evt.FeedID)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	posts, err := h.postRepo.ByIDs(ctx, evt.PostIDs)
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	wg, subCtx := errgroup.WithContext(ctx)

	for _, sub := range subs {
		cmd := ImportTweetsCommand{
			Subscription: sub,
			Posts:        posts,
		}
		wg.Go(func() error {
			_, err := h.bus.Run(subCtx, cmd)
			return err
		})
	}

	if err := wg.Wait(); err != nil {
		trace.Error(ctx, err)
		return
	}
}
