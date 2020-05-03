package tweets

import (
	"context"
	"fmt"
	"strconv"

	"github.com/dghubble/go-twitter/twitter"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type SendTweetCommand struct {
	TweetGroup *model.TweetGroup
}

func (h *CommandHandler) handleSendTweet(ctx context.Context, cmd SendTweetCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroup.ID)...)

	tg := cmd.TweetGroup
	span.SetAttributes(key.String("tweet.action", string(tg.Action)))

	var postedURLs []string

	switch tg.Action {
	case model.ActionTweet:
		var lastPostedID int64
		var postedIDs []int64

		for _, tweet := range tg.Tweets {
			err := tracer.WithSpan(ctx, "SendTweetCommand.sendTweet", func(ctx context.Context) error {
				span := trace.SpanFromContext(ctx)

				postedTweet, err := h.externalTweetRepo.Create(ctx, tg.UserID(), tweet, lastPostedID)
				if err != nil {
					return err
				}

				span.SetAttributes(
					key.Int64("tweet.posted_tweet_id", postedTweet.ID),
					key.Int64("tweet.in_reply_to", lastPostedID))

				lastPostedID = postedTweet.ID
				postedIDs = append(postedIDs, lastPostedID)

				tweetURL := urlFromTweet(postedTweet)
				span.SetAttributes(keys.TweetURL(tweetURL))
				postedURLs = append(postedURLs, tweetURL)

				return nil
			})
			if err != nil {
				return err
			}
		}

		if err := h.tweetRepo.Post(ctx, tg.ID, postedIDs); err != nil {
			return err
		}

	case model.ActionRetweet:
		retweetID, err := strconv.ParseInt(tg.RetweetID, 10, 64)
		if err != nil {
			return err
		}

		postedTweet, err := h.externalTweetRepo.Retweet(ctx, tg.UserID(), retweetID)
		if err != nil {
			return err
		}

		span.SetAttributes(key.Int64("tweet.posted_tweet_id", postedTweet.ID))

		tweetURL := urlFromTweet(postedTweet)
		span.SetAttributes(keys.TweetURL(tweetURL))
		postedURLs = []string{tweetURL}

		if err := h.tweetRepo.PostRetweet(ctx, tg.ID, postedTweet.ID); err != nil {
			return err
		}
	}

	if _, err := h.bus.Run(ctx, SyndicateCommand{
		TweetGroup: tg,
		TweetURLs:  postedURLs,
	}); err != nil {
		return err
	}

	return nil
}

func urlFromTweet(t *twitter.Tweet) string {
	return fmt.Sprintf("https://twitter.com/%s/status/%d", t.User.ScreenName, t.ID)
}
