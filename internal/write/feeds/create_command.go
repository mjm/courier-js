package feeds

import (
	"context"
	"net/url"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/locatefeed"
)

type CreateCommand struct {
	UserID string
	URL    string
}

func (h *CommandHandler) handleCreate(ctx context.Context, cmd CreateCommand) (FeedID, error) {
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
		}

		if err != nil {
			return "", err
		}
	} else {
		feedID = f.ID
	}

	h.eventBus.Fire(ctx, feeds.FeedCreated{
		FeedID: feedID,
		URL:    u.String(),
	})

	_, err = h.bus.Run(ctx, RefreshCommand{
		UserID: cmd.UserID,
		FeedID: feedID,
	})

	trace.FeedID(ctx, feedID)
	return feedID, nil
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
