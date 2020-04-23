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
	span.SetAttributes(keys.FeedID(cmd.FeedID), entryCountKey(len(cmd.Entries)))

	if len(cmd.Entries) == 0 {
		return nil
	}

	var oldestPublished *time.Time
	for _, entry := range cmd.Entries {
		if entry.PublishedAt != nil && (oldestPublished == nil || entry.PublishedAt.Before(*oldestPublished)) {
			oldestPublished = entry.PublishedAt
		}
	}

	var oldestPublishedStr string
	if oldestPublished != nil {
		oldestPublishedStr = oldestPublished.Format(time.RFC3339)
		span.SetAttributes(key.String("import.oldest_published", oldestPublishedStr))
	}

	// TODO replace with a similar method that uses LSI1
	f, err := h.feedRepo.GetWithRecentItems(ctx, cmd.FeedID, oldestPublished)
	if err != nil {
		return err
	}

	postsByItemID := make(map[string]*model.Post)
	for _, post := range f.Posts {
		p := post.Post
		postsByItemID[post.ItemID()] = &p
	}

	var ps []shared.WritePostParams
	for _, entry := range cmd.Entries {
		post, ok := postsByItemID[entry.ID]
		if ok && postMatchesEntry(post, entry) {
			continue
		}

		ps = append(ps, shared.WritePostParams{
			ID:          model.PostIDFromParts(cmd.FeedID, entry.ID),
			TextContent: entry.TextContent,
			HTMLContent: entry.HTMLContent,
			Title:       entry.Title,
			URL:         entry.URL,
			PublishedAt: entry.PublishedAt,
			ModifiedAt:  entry.ModifiedAt,
		})
	}

	if err := h.postRepo.Write(ctx, ps); err != nil {
		return err
	}

	if len(ps) > 0 {
		h.events.Fire(ctx, feeds.PostsImported{
			FeedId:            string(cmd.FeedID),
			OldestPublishedAt: oldestPublishedStr,
			UserId:            cmd.UserID,
		})
	}

	return nil
}

func postMatchesEntry(post *model.Post, entry *scraper.Entry) bool {
	return post.URL == entry.URL && post.Title == entry.Title && post.TextContent == entry.TextContent &&
		post.HTMLContent == entry.HTMLContent && equalTime(post.PublishedAt, entry.PublishedAt) &&
		equalTime(post.ModifiedAt, entry.ModifiedAt)
}

func equalTime(t1 *time.Time, t2 *time.Time) bool {
	if t1 == nil {
		return t2 == nil
	}

	if t2 == nil {
		return false
	}

	return *t1 == *t2
}
