package tweets

import (
	"context"
	"net/url"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/micropub"
)

type SyndicateCommand struct {
	UserID   string
	PostID   feeds.PostID
	TweetURL string
}

func (h *CommandHandler) handleSyndicate(ctx context.Context, cmd SyndicateCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.PostID(ctx, cmd.PostID)
	trace.AddField(ctx, "tweet.url", cmd.TweetURL)

	info, err := h.postRepo.MicropubInfo(ctx, cmd.PostID)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "feed.home_page_url", info.HomePageURL)
	trace.AddField(ctx, "post.url", info.URL)
	trace.AddField(ctx, "feed.microbub_endpoint", info.MPEndpoint)

	token, err := h.userRepo.MicropubToken(ctx, cmd.UserID, info.HomePageURL)
	if err != nil {
		return err
	}
	trace.AddField(ctx, "micropub.token_length", len(token))

	if token == "" {
		return nil
	}

	u, err := url.Parse(info.MPEndpoint)
	if err != nil {
		return err
	}

	if err := updateMicropub(ctx, u, token, info.URL, cmd.TweetURL); err != nil {
		return err
	}

	return nil
}

func updateMicropub(ctx context.Context, endpoint *url.URL, token string, postURL string, tweetURL string) error {
	ctx = trace.Start(ctx, "Micropub: Update entry")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "micropub.endpoint", endpoint.String())
	trace.AddField(ctx, "micropub.token_length", len(token))
	trace.AddField(ctx, "post.url", postURL)
	trace.AddField(ctx, "tweet.url", tweetURL)

	client := micropub.NewClient(endpoint, token)
	if _, err := client.Update(ctx, micropub.Update{
		URL: postURL,
		Add: map[string][]interface{}{
			"syndication": {tweetURL},
		},
	}); err != nil {
		trace.Error(ctx, err)
		return err
	}

	return nil
}
