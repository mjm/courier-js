package tweets

import (
	"context"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/trace/keys"
)

type SetupSyndicationCommand struct {
	UserID string
	URL    string
	Token  string
}

func (h *CommandHandler) handleSetupSyndication(ctx context.Context, cmd SetupSyndicationCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		kv.String("micropub.url", cmd.URL),
		kv.Int("micropub.token_length", len(cmd.Token)))

	if err := h.userRepo.SetMicropubToken(ctx, cmd.UserID, cmd.URL, cmd.Token); err != nil {
		return err
	}

	return nil
}
