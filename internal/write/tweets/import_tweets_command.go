package tweets

import (
	"context"
	"reflect"
	"time"

	"github.com/segmentio/ksuid"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/tasks"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/pkg/htmltweets"

	"golang.org/x/sync/errgroup"
)

// ImportTweetsCommand represents a request to create or update tweets in a subscription
// to match some posts that were imported.
type ImportTweetsCommand struct {
	UserID          string
	FeedID          model.FeedID
	OldestPublished *time.Time
}

func (h *CommandHandler) handleImportTweets(ctx context.Context, cmd ImportTweetsCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.FeedID(cmd.FeedID))

	feed, err := h.feedRepo.GetWithRecentItems(ctx, cmd.FeedID, cmd.OldestPublished)
	if err != nil {
		return err
	}

	span.SetAttributes(key.Int("import.post_count", len(feed.Posts)))

	var toCreate []shared.CreateTweetParams
	var toUpdate []shared.UpdateTweetParams

	for _, post := range feed.Posts {
		createTweet, updateTweet, err := h.planTweet(ctx, cmd.UserID, feed.Autopost, post)
		if err != nil {
			return err
		}

		if createTweet != nil {
			toCreate = append(toCreate, *createTweet)
		}
		if updateTweet != nil {
			toUpdate = append(toUpdate, *updateTweet)
		}
	}

	span.SetAttributes(
		key.Int("import.tweet_create_count", len(toCreate)),
		key.Int("import.tweet_update_count", len(toUpdate)))

	wg, subCtx := errgroup.WithContext(ctx)

	if len(toCreate) > 0 {
		wg.Go(func() error {
			return h.tweetRepo.Create(subCtx, toCreate)
		})
	}

	for _, params := range toUpdate {
		params := params
		wg.Go(func() error {
			return h.tweetRepo.Update(subCtx, params)
		})
	}

	if err := wg.Wait(); err != nil {
		return err
	}

	if feed.Autopost {
		for _, t := range toCreate {
			task := &tweets.PostTweetTask{
				UserId:   t.ID.UserID,
				FeedId:   string(t.ID.FeedID),
				ItemId:   t.ID.ItemID,
				Autopost: true,
			}
			if _, err := h.tasks.Enqueue(ctx, task, tasks.After(5*time.Minute), tasks.Named(t.PostTaskName)); err != nil {
				return err
			}
		}
	}

	evt := tweets.TweetsImported{
		UserId:   feed.UserID,
		FeedId:   string(feed.ID),
		Autopost: feed.Autopost,
	}
	for _, params := range toCreate {
		evt.CreatedItemIds = append(evt.CreatedItemIds, params.ID.ItemID)
	}
	for _, params := range toUpdate {
		evt.UpdatedItemIds = append(evt.UpdatedItemIds, params.ID.ItemID)
	}

	if len(evt.CreatedItemIds) > 0 || len(evt.UpdatedItemIds) > 0 {
		h.events.Fire(ctx, evt)
	}

	return nil
}

func (h *CommandHandler) planTweet(ctx context.Context, userID string, autopost bool, post *shared.PostWithTweetGroup) (*shared.CreateTweetParams, *shared.UpdateTweetParams, error) {
	ctx, span := tracer.Start(ctx, "ImportTweetsCommand.planTweet",
		trace.WithAttributes(keys.PostID(post.ID)...),
		trace.WithAttributes(
			keys.UserID(userID),
			key.Bool("feed.autopost", autopost),
			key.Bool("import.existing_tweet.present", post.TweetGroup != nil)))
	defer span.End()

	if post.TweetGroup != nil {
		span.SetAttributes(
			key.String("import.existing_tweet.status", string(post.TweetGroup.Status)),
			key.Int("import.existing_tweet.count", len(post.TweetGroup.Tweets)))

		if post.TweetGroup.Status == model.Posted {
			// do nothing if there's a tweet group and it's been posted to Twitter already
			return nil, nil, nil
		}
	}

	translated, err := htmltweets.Translate(htmltweets.Input{
		Title: post.Title,
		URL:   post.URL,
		HTML:  post.HTMLContent,
	})
	if err != nil {
		span.RecordError(ctx, err)
		return nil, nil, err
	}

	span.SetAttributes(key.Int("import.translated_tweet.count", len(translated)))

	var retweetID string
	var ts []*model.Tweet

	for _, newTweet := range translated {
		switch newTweet.Action {
		case htmltweets.ActionTweet:
			ts = append(ts, &model.Tweet{
				Body:      newTweet.Body,
				MediaURLs: newTweet.MediaURLs,
			})
		case htmltweets.ActionRetweet:
			retweetID = newTweet.RetweetID
		}
	}

	if post.TweetGroup == nil {
		pubAt := time.Now()
		if post.PublishedAt != nil {
			pubAt = *post.PublishedAt
		}
		return &shared.CreateTweetParams{
			ID:           model.TweetGroupIDFromParts(userID, post.FeedID(), post.ItemID()),
			PublishedAt:  pubAt,
			URL:          post.URL,
			Tweets:       ts,
			RetweetID:    retweetID,
			Autopost:     autopost,
			PostTaskName: ksuid.New().String(),
		}, nil, nil
	}

	// check if there are changes from the existing tweet contents, avoid an update call
	// if there are no changes.
	if post.TweetGroup.URL == post.URL && post.TweetGroup.RetweetID == retweetID && reflect.DeepEqual(post.TweetGroup.Tweets, ts) {
		return nil, nil, nil
	}

	return nil, &shared.UpdateTweetParams{
		ID:        post.TweetGroup.ID,
		URL:       post.URL,
		Tweets:    ts,
		RetweetID: retweetID,
	}, nil
}
