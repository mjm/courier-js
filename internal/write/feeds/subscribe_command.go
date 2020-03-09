package feeds

import (
	"context"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
)

// SubscribeCommand is a request to subscribe a user to a feed by URL.
type SubscribeCommand struct {
	// UserID is the ID of the user subscribing to the feed.
	UserID string
	// URL is the URL the user entered that they wish to subscribe to. This URL may be
	// for a web page, not a feed, in which case we need to locate the actual feed for
	// the site via link tags.
	URL string
}

func (h *CommandHandler) handleSubscribe(ctx context.Context, cmd SubscribeCommand) (SubscriptionID, error) {
	trace.UserID(ctx, cmd.UserID)
	trace.FeedURL(ctx, cmd.URL)

	v, err := h.bus.Run(ctx, CreateCommand{
		UserID: cmd.UserID,
		URL:    cmd.URL,
	})
	if err != nil {
		return "", err
	}

	feedID := v.(FeedID)
	trace.FeedID(ctx, feedID)

	subID, err := h.subRepo.Create(ctx, cmd.UserID, feedID)
	if err != nil {
		return "", err
	}

	trace.FeedSubscriptionID(ctx, subID)
	h.events.Fire(ctx, feeds.FeedSubscribed{
		UserId:             cmd.UserID,
		FeedId:             feedID.String(),
		FeedSubscriptionId: subID.String(),
	})

	return subID, nil
}
