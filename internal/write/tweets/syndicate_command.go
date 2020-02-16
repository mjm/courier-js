package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
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

	return nil
}
