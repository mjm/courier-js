package feeds

import (
	"context"
	"net/url"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
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

func (h *CommandHandler) handleSubscribe(ctx context.Context, cmd SubscribeCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.UserID(cmd.UserID), keys.FeedURL(cmd.URL))

	u, err := url.Parse(cmd.URL)
	if err != nil {
		return err
	}

	u, err = locatefeed.Locate(ctx, u)
	if err != nil {
		return err
	}

	span.SetAttributes(key.String("feed.resolved_url", u.String()))

	// TODO handle existing feed for the URL

	feedID := model.NewFeedID()
	span.SetAttributes(keys.FeedIDDynamo(feedID))

	if err := h.feedRepoDynamo.Create(ctx, cmd.UserID, feedID, u.String()); err != nil {
		return err
	}

	_, err = h.bus.Run(ctx, RefreshCommand{
		UserID: cmd.UserID,
		FeedID: feedID,
	})

	h.events.Fire(ctx, feeds.FeedSubscribed{
		UserId: cmd.UserID,
		FeedId: string(feedID),
	})

	return nil
}
