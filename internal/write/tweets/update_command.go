package tweets

import (
	"context"
	"errors"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/tweets"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var (
	ErrRetweet = errors.New("cannot edit retweet")
)

type UpdateCommand struct {
	UserID    string
	TweetID   TweetID
	Body      string
	MediaURLs []string
}

func (h *CommandHandler) handleUpdate(ctx context.Context, cmd UpdateCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.TweetID(cmd.TweetID),
		key.Int("tweet.body_length", len(cmd.Body)),
		key.Int("tweet.media_url_count", len(cmd.MediaURLs)))

	// fetch the existing tweet so we can do some validation
	t, err := h.tweetRepo.Get(ctx, cmd.UserID, cmd.TweetID)
	if err != nil {
		return err
	}

	span.SetAttributes(
		keys.TweetStatus(string(t.Status)),
		key.String("tweet.action", string(t.Action)))

	if t.Status != Draft {
		return ErrNotDraft
	}

	if t.Action != ActionTweet {
		return ErrRetweet
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

	h.events.Fire(ctx, tweets.TweetEdited{
		UserId:  cmd.UserID,
		TweetId: cmd.TweetID.String(),
	})

	return nil
}
