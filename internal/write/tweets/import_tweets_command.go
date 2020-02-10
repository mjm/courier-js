package tweets

import (
	"context"
	"sync"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/event/tweetevent"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/htmltweets"

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

	var postIDs []PostID
	for _, p := range cmd.Posts {
		postIDs = append(postIDs, p.ID)
	}

	tweetsByPost, err := h.tweetRepo.ByPostIDs(ctx, cmd.Subscription.ID, postIDs)
	if err != nil {
		return err
	}

	wg, subCtx := errgroup.WithContext(ctx)
	var toCreate []CreateTweetParams
	var toUpdate []UpdateTweetParams
	var lock sync.Mutex

	for _, post := range cmd.Posts {
		post := post
		tweets := tweetsByPost[post.ID]

		wg.Go(func() error {
			newTweets, updateTweets, err := h.planTweets(subCtx, post, tweets)
			if err != nil {
				return err
			}

			lock.Lock()
			defer lock.Unlock()
			toCreate = append(toCreate, newTweets...)
			toUpdate = append(toUpdate, updateTweets...)
			return nil
		})
	}

	if err := wg.Wait(); err != nil {
		return err
	}

	trace.Add(ctx, trace.Fields{
		"import.tweet_create_count": len(toCreate),
		"import.tweet_update_count": len(toUpdate),
	})

	if err := h.tweetRepo.Create(ctx, cmd.Subscription.ID, cmd.Subscription.Autopost, toCreate); err != nil {
		return err
	}

	if err := h.tweetRepo.Update(ctx, toUpdate); err != nil {
		return err
	}

	eventBase := tweetevent.TweetsImported{
		UserID:         cmd.Subscription.UserID,
		SubscriptionID: string(cmd.Subscription.ID),
	}

	createdEvt := tweetevent.TweetsCreated{TweetsImported: eventBase}
	for _, params := range toCreate {
		createdEvt.TweetIDs = append(createdEvt.TweetIDs, string(params.ID))
	}
	if len(createdEvt.TweetIDs) > 0 {
		h.eventBus.Fire(ctx, createdEvt)
	}

	updatedEvt := tweetevent.TweetsUpdated{TweetsImported: eventBase}
	for _, params := range toUpdate {
		updatedEvt.TweetIDs = append(updatedEvt.TweetIDs, string(params.ID))
	}
	if len(updatedEvt.TweetIDs) > 0 {
		h.eventBus.Fire(ctx, updatedEvt)
	}

	importedEvt := eventBase
	importedEvt.TweetIDs = append([]string{}, createdEvt.TweetIDs...)
	importedEvt.TweetIDs = append(importedEvt.TweetIDs, updatedEvt.TweetIDs...)
	if len(importedEvt.TweetIDs) > 0 {
		h.eventBus.Fire(ctx, importedEvt)
	}

	return nil
}

func (h *CommandHandler) planTweets(ctx context.Context, post *Post, tweets []*Tweet) ([]CreateTweetParams, []UpdateTweetParams, error) {
	ctx = trace.Start(ctx, "Plan tweets")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"post.id":                     post.ID,
		"import.existing_tweet_count": len(tweets),
	})

	translated, err := htmltweets.Translate(htmltweets.Input{
		Title: post.Title,
		URL:   post.URL,
		HTML:  post.HTMLContent,
	})
	if err != nil {
		return nil, nil, err
	}

	trace.Add(ctx, trace.Fields{
		"import.translated_tweet_count": len(translated),
	})

	var toCreate []CreateTweetParams
	var toUpdate []UpdateTweetParams

	for i, newTweet := range translated {
		if len(tweets) > i {
			existingTweet := tweets[i]
			if existingTweet.Status == Posted {
				continue
			}

			t := UpdateTweetParams{ID: existingTweet.ID}

			switch newTweet.Action {
			case htmltweets.ActionTweet:
				t.Action = ActionTweet
				t.Body = newTweet.Body
				t.MediaURLs = newTweet.MediaURLs
			case htmltweets.ActionRetweet:
				t.Action = ActionRetweet
				t.RetweetID = newTweet.RetweetID
			}

			toUpdate = append(toUpdate, t)
		} else {
			t := CreateTweetParams{
				ID:       NewTweetID(),
				PostID:   post.ID,
				Position: i,
			}

			switch newTweet.Action {
			case htmltweets.ActionTweet:
				t.Action = ActionTweet
				t.Body = newTweet.Body
				t.MediaURLs = newTweet.MediaURLs
			case htmltweets.ActionRetweet:
				t.Action = ActionRetweet
				t.RetweetID = newTweet.RetweetID
			}

			toCreate = append(toCreate, t)
		}
	}

	trace.Add(ctx, trace.Fields{
		"import.created_count": len(toCreate),
		"import.updated_count": len(toUpdate),
	})

	return toCreate, toUpdate, nil
}

func (h *CommandHandler) handlePostsImported(ctx context.Context, evt feedevent.PostsImported) {
	subs, err := h.subRepo.ByFeedID(ctx, FeedID(evt.FeedID))
	if err != nil {
		trace.Error(ctx, err)
		return
	}

	var postIDs []PostID
	for _, id := range evt.PostIDs {
		postIDs = append(postIDs, PostID(id))
	}

	posts, err := h.postRepo.ByIDs(ctx, postIDs)
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
