package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type ImportRecentPostsCommand struct {
	UserID         string
	SubscriptionID feeds.SubscriptionID
}

func (h *CommandHandler) handleImportRecentPosts(ctx context.Context, cmd ImportRecentPostsCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedSubscriptionID(cmd.SubscriptionID))

	sub, err := h.subRepo.Get(ctx, cmd.SubscriptionID)
	if err != nil {
		return err
	}

	posts, err := h.postRepo.RecentPosts(ctx, sub.FeedID)
	if err != nil {
		return err
	}

	span.SetAttributes(key.Int("import.recent_post_count", len(posts)))

	importCmd := ImportTweetsCommand{
		Subscription: sub,
		Posts:        posts,
	}
	if _, err := h.bus.Run(ctx, importCmd); err != nil {
		return err
	}

	return nil
}
