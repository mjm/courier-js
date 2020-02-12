package tweets

import (
	"context"
	"fmt"

	"github.com/mjm/courier-js/internal/event/tweetevent"
	"github.com/mjm/courier-js/internal/trace"
)

type UpdateCommand struct {
	UserID    string
	TweetID   TweetID
	Body      string
	MediaURLs []string
}

func (h *CommandHandler) handleUpdate(ctx context.Context, cmd UpdateCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":               cmd.UserID,
		"tweet.id":              cmd.TweetID,
		"tweet.body_length":     len(cmd.Body),
		"tweet.media_url_count": len(cmd.MediaURLs),
	})

	// fetch the existing tweet so we can do some validation
	t, err := h.tweetRepo.Get(ctx, cmd.UserID, cmd.TweetID)
	if err != nil {
		return err
	}

	if t.Status != Draft {
		return ErrNotDraft
	}

	if t.Action != ActionTweet {
		return fmt.Errorf("cannot edit retweet")
	}

	params := UpdateTweetParams{
		ID:        cmd.TweetID,
		Action:    t.Action,
		Body:      cmd.Body,
		MediaURLs: t.MediaURLs,
	}
	if cmd.MediaURLs != nil {
		params.MediaURLs = cmd.MediaURLs
	}
	if err := h.tweetRepo.Update(ctx, []UpdateTweetParams{params}); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, tweetevent.TweetEdited{
		UserID:  cmd.UserID,
		TweetID: cmd.TweetID.String(),
	})

	h.eventBus.Fire(ctx, tweetevent.TweetsUpdated{
		TweetsImported: tweetevent.TweetsImported{
			UserID:         cmd.UserID,
			SubscriptionID: string(t.FeedSubscriptionID),
			TweetIDs:       []string{cmd.TweetID.String()},
		},
	})

	return nil
}
