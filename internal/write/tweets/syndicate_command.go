package tweets

import (
	"context"
	"net/url"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/pkg/micropub"
)

type SyndicateCommand struct {
	UserID   string
	PostID   feeds.PostID
	TweetURL string
}

func (h *CommandHandler) handleSyndicate(ctx context.Context, cmd SyndicateCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.PostID(cmd.PostID),
		keys.TweetURL(cmd.TweetURL))

	info, err := h.postRepo.MicropubInfo(ctx, cmd.PostID)
	if err != nil {
		return err
	}

	span.SetAttributes(
		keys.FeedHomePageURL(info.HomePageURL),
		key.String("post.url", info.URL),
		key.String("feed.micropub_endpoint", info.MPEndpoint))

	token, err := h.userRepo.MicropubToken(ctx, cmd.UserID, info.HomePageURL)
	if err != nil {
		return err
	}

	span.SetAttributes(key.Int("micropub.token_length", len(token)))

	if token == "" {
		return nil
	}

	u, err := url.Parse(info.MPEndpoint)
	if err != nil {
		return err
	}

	client := micropub.NewClient(u, token)
	if _, err := client.Update(ctx, micropub.Update{
		URL: info.URL,
		Add: map[string][]interface{}{
			"syndication": {cmd.TweetURL},
		},
	}); err != nil {
		return err
	}

	return nil
}
