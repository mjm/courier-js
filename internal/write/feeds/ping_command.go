package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/trace/keys"
)

type PingCommand struct {
	HomePageURL string
}

func (h *CommandHandler) handlePing(ctx context.Context, cmd PingCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.FeedHomePageURL(cmd.HomePageURL))

	fs, err := h.feedRepo.ByHomePageURL(ctx, cmd.HomePageURL)
	if err != nil {
		return err
	}

	span.SetAttributes(key.Int("ping.feed_count", len(fs)))

	for _, feed := range fs {
		if _, err := h.bus.Run(ctx, QueueRefreshCommand{
			UserID: feed.UserID,
			FeedID: feed.ID,
		}); err != nil {
			return err
		}
	}

	return nil
}
