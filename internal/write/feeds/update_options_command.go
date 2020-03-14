package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace/keys"
)

type UpdateOptionsCommand struct {
	UserID         string
	SubscriptionID SubscriptionID
	Autopost       bool
}

func (h *CommandHandler) handleUpdateOptions(ctx context.Context, cmd UpdateOptionsCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.FeedSubscriptionID(cmd.SubscriptionID),
		key.Bool("feed.autopost", cmd.Autopost))

	if err := h.subRepo.Update(ctx, cmd.UserID, UpdateSubscriptionParams{
		ID:       cmd.SubscriptionID,
		Autopost: cmd.Autopost,
	}); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedOptionsChanged{
		FeedSubscriptionId: cmd.SubscriptionID.String(),
		UserId:             cmd.UserID,
		Autopost:           cmd.Autopost,
	})

	return nil
}
