package feeds

import (
	"context"
	"net/url"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/shared/feeds"
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

func (h *CommandHandler) handleSubscribe(ctx context.Context, cmd SubscribeCommand) (SubscriptionID, error) {
	trace.UserID(ctx, cmd.UserID)
	trace.FeedURL(ctx, cmd.URL)

	u, err := url.Parse(cmd.URL)
	if err != nil {
		return "", err
	}

	u, err = locateFeed(ctx, u)
	if err != nil {
		return "", err
	}

	trace.AddField(ctx, "feed.resolved_url", u.String())

	var feedID FeedID
	f, err := h.feedRepo.GetByURL(ctx, u.String())
	if err != nil {
		if err == ErrNoFeed {
			feedID = feeds.NewFeedID()
			err = h.feedRepo.Create(ctx, feedID, u.String())
			if err != nil {
				return "", err
			}

			h.eventBus.Fire(ctx, feedevent.FeedCreated{
				FeedID: feedID.String(),
				URL:    u.String(),
			})

			_, err = h.bus.Run(ctx, RefreshCommand{
				UserID: cmd.UserID,
				FeedID: feedID,
			})
		}

		if err != nil {
			return "", err
		}
	} else {
		feedID = f.ID
	}

	trace.FeedID(ctx, feedID)

	subID, err := h.subRepo.Create(ctx, cmd.UserID, feedID)
	if err != nil {
		return "", err
	}

	trace.FeedSubscriptionID(ctx, subID)
	h.eventBus.Fire(ctx, feedevent.FeedSubscribed{
		UserID:         cmd.UserID,
		FeedID:         feedID.String(),
		SubscriptionID: subID.String(),
	})

	return subID, nil
}

func locateFeed(ctx context.Context, u *url.URL) (*url.URL, error) {
	ctx = trace.Start(ctx, "Locate feed")
	defer trace.Finish(ctx)

	trace.FeedURL(ctx, u.String())

	u, err := locatefeed.Locate(ctx, u)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return u, nil
}
