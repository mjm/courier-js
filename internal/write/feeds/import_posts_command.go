package feeds

import (
	"context"
	"time"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/pkg/scraper"
)

const maxPostLength = 15000

var (
	entryCountKey = kv.Key("import.entry_count").Int
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
		span.SetAttributes(kv.String("import.oldest_published", oldestPublishedStr))
	} else {
		return nil
	}

	posts, err := h.postRepo.Recent(ctx, cmd.FeedID, *oldestPublished)
	if err != nil {
		return err
	}

	var oldestExisting *time.Time
	postsByItemID := make(map[string]*model.Post)
	for _, post := range posts {
		postsByItemID[post.ItemID()] = post
		if post.PublishedAt != nil && (oldestExisting == nil || post.PublishedAt.Before(*oldestPublished)) {
			oldestExisting = post.PublishedAt
		}
	}

	var ps []shared.WritePostParams
	oldestPublished = nil

	entriesToScan := cmd.Entries
	// on the initial import, we won't have any existing posts, and we don't really want to import their whole
	// feed, since we don't know how long it could be and they probably don't want to tweet old posts anyway. so
	// we grab the first 10 in this case.
	if len(posts) == 0 && len(entriesToScan) > 10 {
		entriesToScan = entriesToScan[:10]
	}

	for _, entry := range entriesToScan {
		// don't import post content if the post has a title, since we know it won't get used
		if entry.Title != "" {
			entry.HTMLContent = ""
		}

		// truncate HTML content to avoid coming close to the max size of an item in DynamoDB
		if len(entry.HTMLContent) > maxPostLength {
			entry.HTMLContent = entry.HTMLContent[:maxPostLength]
		}

		post, ok := postsByItemID[entry.ID]
		if ok && postMatchesEntry(post, entry) {
			continue
		}

		// on the first import, we only grab the first 10 posts, but on subsequent refreshes, we'll look at the whole
		// feed. so if a scraped entry doesn't match an existing post, we check if it's older than the oldest post we
		// fetched, and if it is, then we assume that it was intentionally skipped in the initial import and we don'
		// create it.
		if !ok && oldestExisting != nil && entry.PublishedAt != nil && entry.PublishedAt.Before(*oldestExisting) {
			continue
		}

		ps = append(ps, shared.WritePostParams{
			ID:          model.PostIDFromParts(cmd.FeedID, entry.ID),
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

	oldestPublishedStr = ""
	if oldestPublished != nil {
		oldestPublishedStr = oldestPublished.Format(time.RFC3339)
		span.SetAttributes(kv.String("import.changed.oldest_published", oldestPublishedStr))
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
	return post.URL == entry.URL && post.Title == entry.Title &&
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
