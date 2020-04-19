package feeds

import (
	"context"
	"time"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/pkg/scraper"
)

var (
	entryCountKey = key.New("import.entry_count").Int
)

// ImportPostsCommand is a request to import posts that were scraped from a feed into
// the database.
type ImportPostsCommand struct {
	UserID  string
	FeedID  model.FeedID
	Entries []*scraper.Entry
}

func (h *CommandHandler) handleImportPosts(ctx context.Context, cmd ImportPostsCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(keys.FeedIDDynamo(cmd.FeedID), entryCountKey(len(cmd.Entries)))

	if len(cmd.Entries) == 0 {
		return nil
	}

	var ps []shared.WritePostParams
	var oldestPublished *time.Time
	for _, entry := range cmd.Entries {
		ps = append(ps, shared.WritePostParams{
			ID:          model.PostIDFromParts(cmd.FeedID, entry.ID),
			TextContent: entry.TextContent,
			HTMLContent: entry.HTMLContent,
			Title:       entry.Title,
			URL:         entry.URL,
			PublishedAt: entry.PublishedAt,
			ModifiedAt:  entry.ModifiedAt,
		})

		if entry.PublishedAt != nil && (oldestPublished == nil || entry.PublishedAt.Before(*oldestPublished)) {
			oldestPublished = entry.PublishedAt
		}
	}

	var oldestPublishedStr string
	if oldestPublished != nil {
		oldestPublishedStr = oldestPublished.Format(time.RFC3339)
		span.SetAttributes(key.String("import.oldest_published", oldestPublishedStr))
	}

	if err := h.postRepoDynamo.Write(ctx, ps); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.PostsImported{
		FeedId:            string(cmd.FeedID),
		OldestPublishedAt: oldestPublishedStr,
		UserId:            cmd.UserID,
	})

	return nil
}
