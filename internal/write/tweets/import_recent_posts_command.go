package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/trace"
)

type ImportRecentPostsCommand struct {
	UserID         string
	SubscriptionID FeedSubscriptionID
}

func (h *CommandHandler) handleImportRecentPosts(ctx context.Context, cmd ImportRecentPostsCommand) error {
	trace.Add(ctx, trace.Fields{
		"feed.subscription_id": cmd.SubscriptionID,
		"user_id":              cmd.UserID,
	})

	sub, err := h.subRepo.Get(ctx, cmd.SubscriptionID)
	if err != nil {
		return err
	}

	posts, err := h.postRepo.RecentPosts(ctx, sub.FeedID)
	if err != nil {
		return err
	}

	trace.Add(ctx, trace.Fields{
		"import.recent_post_count": len(posts),
	})

	importCmd := ImportTweetsCommand{
		Subscription: sub,
		Posts:        posts,
	}
	if _, err := h.bus.Run(ctx, importCmd); err != nil {
		return err
	}

	return nil
}

func (h *CommandHandler) handleFeedSubscribed(ctx context.Context, evt feedevent.FeedSubscribed) {
	_, _ = h.bus.Run(ctx, ImportRecentPostsCommand{
		UserID:         evt.UserID,
		SubscriptionID: FeedSubscriptionID(evt.SubscriptionID),
	})
}
