package feeds

import (
	"context"
	"time"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/event/feedevent"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/scraper"
)

// ImportPostsCommand is a request to import posts that were scraped from a feed into
// the database.
type ImportPostsCommand struct {
	FeedID  FeedID
	Entries []*scraper.Entry
}

func (h *CommandHandler) handleImportPosts(ctx context.Context, cmd ImportPostsCommand) error {
	trace.FeedID(ctx, cmd.FeedID)
	trace.Add(ctx, trace.Fields{
		"import.entry_count": len(cmd.Entries),
	})

	toCreate, toUpdate, unchanged, err := h.planPostChanges(ctx, cmd.FeedID, cmd.Entries)
	if err != nil {
		return err
	}

	trace.Add(ctx, trace.Fields{
		"import.created_count":   len(toCreate),
		"import.updated_count":   len(toUpdate),
		"import.unchanged_count": unchanged,
	})

	changed, err := h.applyPostChanges(ctx, cmd.FeedID, toCreate, toUpdate)
	if err != nil {
		return err
	}

	trace.AddField(ctx, "import.changed_count", len(changed))
	if len(changed) > 0 {
		var ids []string
		for _, p := range changed {
			ids = append(ids, p.ID.String())
		}

		h.eventBus.Fire(ctx, feedevent.PostsImported{
			FeedID:  cmd.FeedID.String(),
			PostIDs: ids,
		})
	}

	return nil
}

func (h *CommandHandler) planPostChanges(ctx context.Context, feedID FeedID, entries []*scraper.Entry) (toCreate []CreatePostParams, toUpdate []UpdatePostParams, unchanged int, err error) {
	var existing []*Post
	existing, err = h.postRepo.FindByItemIDs(ctx, feedID, entryIDs(entries))
	if err != nil {
		return
	}

	for i, e := range entries {
		var published, modified pq.NullTime
		if e.PublishedAt != nil {
			published.Valid = true
			published.Time = *e.PublishedAt
		}
		if e.ModifiedAt != nil {
			modified.Valid = true
			modified.Time = *e.ModifiedAt
		}

		p := existing[i]
		if p != nil {
			updated := UpdatePostParams{
				ID:          p.ID,
				Title:       e.Title,
				URL:         e.URL,
				TextContent: e.TextContent,
				HTMLContent: e.HTMLContent,
				PublishedAt: e.PublishedAt,
				ModifiedAt:  e.ModifiedAt,
			}

			if hasPostChanged(updated, p) {
				toUpdate = append(toUpdate, updated)
			} else {
				unchanged++
			}
		} else {
			toCreate = append(toCreate, CreatePostParams{
				ID:          feeds.NewPostID(),
				ItemID:      e.ID,
				Title:       e.Title,
				URL:         e.URL,
				TextContent: e.TextContent,
				HTMLContent: e.HTMLContent,
				PublishedAt: e.PublishedAt,
				ModifiedAt:  e.ModifiedAt,
			})
		}
	}

	return
}

func (h *CommandHandler) applyPostChanges(ctx context.Context, feedID FeedID, toCreate []CreatePostParams, toUpdate []UpdatePostParams) ([]*Post, error) {
	var changed []*Post

	created, err := h.postRepo.Create(ctx, feedID, toCreate)
	if err != nil {
		return nil, err
	}
	changed = append(changed, created...)

	updated, err := h.postRepo.Update(ctx, toUpdate)
	if err != nil {
		return nil, err
	}
	changed = append(changed, updated...)

	return changed, nil
}

func entryIDs(entries []*scraper.Entry) []string {
	var ids []string

	for _, e := range entries {
		ids = append(ids, e.ID)
	}

	return ids
}

func hasPostChanged(n UpdatePostParams, o *Post) bool {
	return n.Title != o.Title || n.URL != o.URL || n.TextContent != o.TextContent || n.HTMLContent != o.HTMLContent || !isSameTime(n.PublishedAt, o.PublishedAt) || !isSameTime(n.ModifiedAt, o.ModifiedAt)
}

func isSameTime(a *time.Time, b pq.NullTime) bool {
	if a == nil {
		return !b.Valid
	}

	if !b.Valid {
		return false
	}

	return a.Equal(b.Time)
}
