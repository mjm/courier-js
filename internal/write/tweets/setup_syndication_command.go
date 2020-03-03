package tweets

import (
	"context"

	"github.com/mjm/courier-js/internal/trace"
)

type SetupSyndicationCommand struct {
	UserID string
	URL    string
	Token  string
}

func (h *CommandHandler) handleSetupSyndication(ctx context.Context, cmd SetupSyndicationCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.AddField(ctx, "micropub.url", cmd.URL)
	trace.AddField(ctx, "micropub.token_length", len(cmd.Token))

	if err := h.userRepo.SetMicropubToken(ctx, cmd.UserID, cmd.URL, cmd.Token); err != nil {
		return err
	}

	return nil
}
