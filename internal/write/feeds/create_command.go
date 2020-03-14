package feeds

import (
	"context"
	"net/url"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/pkg/locatefeed"
)

type CreateCommand struct {
	UserID string
	URL    string
}

func (h *CommandHandler) handleCreate(ctx context.Context, cmd CreateCommand) (FeedID, error) {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedURL(cmd.URL))

	u, err := url.Parse(cmd.URL)
	if err != nil {
		return "", err
	}

	u, err = locatefeed.Locate(ctx, u)
	if err != nil {
		return "", err
	}

	span.SetAttributes(key.String("feed.resolved_url", u.String()))

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

	span.SetAttributes(keys.FeedID(feedID))
	return feedID, nil
}
