package tweets

import (
	"context"
	"net/url"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/pkg/micropub"
)

type SyndicateCommand struct {
	TweetGroup *model.TweetGroup
	TweetURLs  []string
}

func (h *CommandHandler) handleSyndicate(ctx context.Context, cmd SyndicateCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.TweetGroupID(cmd.TweetGroup.ID)...)
	span.SetAttributes(
		kv.String("post.url", cmd.TweetGroup.URL),
		kv.Int("tweet.url_count", len(cmd.TweetURLs)))

	if cmd.TweetGroup.URL == "" {
		return nil
	}

	f, err := h.feedRepo.Get(ctx, cmd.TweetGroup.UserID(), cmd.TweetGroup.FeedID())
	if err != nil {
		return err
	}

	span.SetAttributes(
		keys.FeedHomePageURL(f.HomePageURL),
		kv.String("feed.micropub_endpoint", f.MicropubEndpoint))

	if f.MicropubEndpoint == "" {
		return nil
	}

	token, err := h.userRepo.MicropubToken(ctx, f.UserID, f.HomePageURL)
	if err != nil {
		return err
	}

	span.SetAttributes(kv.Int("micropub.token_length", len(token)))

	if token == "" {
		return nil
	}

	u, err := url.Parse(f.MicropubEndpoint)
	if err != nil {
		return err
	}

	var urls []interface{}
	for _, u := range cmd.TweetURLs {
		urls = append(urls, u)
	}

	client := micropub.NewClient(u, token)
	if _, err := client.Update(ctx, micropub.Update{
		URL: cmd.TweetGroup.URL,
		Add: map[string][]interface{}{
			"syndication": urls,
		},
	}); err != nil {
		return err
	}

	return nil
}
