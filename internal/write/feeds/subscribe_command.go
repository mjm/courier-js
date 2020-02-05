package feeds

import (
	"context"
	"net/url"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/locatefeed"
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

// HandleSubscribe handles a request from a user to subscribe to a feed.
func (h *CommandHandler) HandleSubscribe(ctx context.Context, cmd SubscribeCommand) (int, error) {
	trace.AddField(ctx, "feed.url", cmd.URL)
	trace.AddField(ctx, "user_id", cmd.UserID)

	u, err := url.Parse(cmd.URL)
	if err != nil {
		return 0, err
	}

	u, err = locateFeed(ctx, u)
	if err != nil {
		return 0, err
	}

	trace.AddField(ctx, "feed.resolved_url", u.String())

	var feedID int
	f, err := h.feedRepo.GetByURL(ctx, u.String())
	if err != nil {
		if err == ErrNoFeed {
			feedID, err = h.feedRepo.Create(ctx, u.String())
			if err != nil {
				return 0, err
			}

			h.eventBus.Fire(ctx, feedevent.FeedCreated{
				FeedID: feedID,
				URL:    u.String(),
			})

			_, err = h.bus.Run(ctx, RefreshCommand{
				UserID: cmd.UserID,
				FeedID: feedID,
			})
		}

		if err != nil {
			return 0, err
		}
	} else {
		feedID = f.ID
	}

	trace.AddField(ctx, "feed.id", feedID)

	subID, err := h.subRepo.Create(ctx, cmd.UserID, feedID)
	if err != nil {
		return 0, err
	}

	trace.AddField(ctx, "feed.subscription_id", subID)
	h.eventBus.Fire(ctx, feedevent.FeedSubscribed{
		UserID:         cmd.UserID,
		FeedID:         feedID,
		SubscriptionID: subID,
	})

	return subID, nil
}

func locateFeed(ctx context.Context, u *url.URL) (*url.URL, error) {
	ctx = trace.Start(ctx, "Locate feed")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "feed.url", u.String())

	u, err := locatefeed.Locate(ctx, u)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return u, nil
}
