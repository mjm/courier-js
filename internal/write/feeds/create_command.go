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

	u, err = locatefeed.Locate(ctx, u)
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

	h.events.Fire(ctx, feeds.FeedCreated{
		UserId: cmd.UserID,
		FeedId: feedID.String(),
		Url:    u.String(),
	})

	_, err = h.bus.Run(ctx, RefreshCommand{
		UserID: cmd.UserID,
		FeedID: feedID,
	})

	trace.FeedID(ctx, feedID)
	return feedID, nil
}
