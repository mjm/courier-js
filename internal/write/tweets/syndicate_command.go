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

	token, err := h.userRepo.MicropubToken(ctx, cmd.UserID, info.HomePageURL)
	if err != nil {
		return err
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
