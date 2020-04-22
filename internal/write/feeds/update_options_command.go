package feeds

import (
	"context"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
)

type UpdateOptionsCommand struct {
	UserID   string
	FeedID   model.FeedID
	Autopost bool
}

func (h *CommandHandler) handleUpdateOptions(ctx context.Context, cmd UpdateOptionsCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.FeedIDDynamo(cmd.FeedID),
		key.Bool("feed.autopost", cmd.Autopost))

	if err := h.feedRepo.UpdateSettings(ctx, shared.UpdateFeedSettingsParams{
		ID:       cmd.FeedID,
		UserID:   cmd.UserID,
		Autopost: cmd.Autopost,
	}); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedOptionsChanged{
		UserId:   cmd.UserID,
		FeedId:   string(cmd.FeedID),
		Autopost: cmd.Autopost,
	})

	return nil
}
