package service

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/lib/pq"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/models/post"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/scraper"
)

type ImportService struct {
	db *db.DB
}

func NewImportService(db *db.DB) *ImportService {
	return &ImportService{
		db: db,
	}
}

// Import creates or updates posts based on entries scraped from a feed. Posts that are
// changed when importing will also have tweets created or updated in any active
// subscriptions that exist for the feed.
func (srv *ImportService) Import(ctx context.Context, feedID int, entries []*scraper.Entry) error {
	ctx = trace.Start(ctx, "Import posts")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"feed.id":            feedID,
		"import.entry_count": len(entries),
	})

	toCreate, toUpdate, unchanged, err := srv.planPostChanges(ctx, feedID, entries)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.Add(ctx, trace.Fields{
		"import.created_count":   len(toCreate),
		"import.updated_count":   len(toUpdate),
		"import.unchanged_count": unchanged,
	})

	changed, err := srv.applyPostChanges(ctx, toCreate, toUpdate)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.AddField(ctx, "import.changed_count", len(changed))

	// create tweets for each subscription
	if len(changed) > 0 {
		subs, err := feed.Subscriptions(ctx, srv.db, feedID)
		if err != nil {
			return err
		}

		trace.AddField(ctx, "import.subscription_count", len(subs))

		wg, subCtx := errgroup.WithContext(ctx)
		for _, sub := range subs {
			sub := sub
			wg.Go(func() error {
				return srv.createSubscriptionTweets(subCtx, sub, changed)
			})
		}
		if err := wg.Wait(); err != nil {
			trace.Error(ctx, err)
			return err
		}
	}

	return nil
}

func (srv *ImportService) planPostChanges(ctx context.Context, feedID int, entries []*scraper.Entry) (toCreate []*post.Post, toUpdate []*post.Post, unchanged int, err error) {
	postLoader := post.NewByItemIDLoader(srv.db, feedID)
	existing, errs := postLoader.LoadMany(ctx, entryKeys(entries))()

	for i, e := range entries {
		if errs[i] != nil {
			err = errs[i]
			return
		}

		var published, modified pq.NullTime
		if e.PublishedAt != nil {
			published.Valid = true
			published.Time = *e.PublishedAt
		}
		if e.ModifiedAt != nil {
			modified.Valid = true
			modified.Time = *e.ModifiedAt
		}

		v := existing[i]
		if v != nil {
			p := v.(*post.Post)
			updated := *p
			updated.Title = e.Title
			updated.URL = e.URL
			updated.TextContent = e.TextContent
			updated.HTMLContent = e.HTMLContent
			updated.PublishedAt = published
			updated.ModifiedAt = modified

			if hasPostChanged(&updated, p) {
				toUpdate = append(toUpdate, &updated)
			} else {
				unchanged++
			}
		} else {
			toCreate = append(toCreate, &post.Post{
				FeedID:      feedID,
				ItemID:      e.ID,
				Title:       e.Title,
				URL:         e.URL,
				TextContent: e.TextContent,
				HTMLContent: e.HTMLContent,
				PublishedAt: published,
				ModifiedAt:  modified,
			})
		}
	}

	return
}

func (srv *ImportService) applyPostChanges(ctx context.Context, toCreate []*post.Post, toUpdate []*post.Post) ([]*post.Post, error) {
	var changed []*post.Post

	l := loaders.Get(ctx).Posts

	created, err := post.Create(ctx, srv.db, toCreate)
	if err != nil {
		return nil, err
	}

	for _, p := range created {
		l.Prime(ctx, loader.IntKey(p.ID), p)
		changed = append(changed, p)
	}

	// TODO apply updates

	return changed, nil
}

func entryKeys(entries []*scraper.Entry) dataloader.Keys {
	var keys dataloader.Keys

	for _, e := range entries {
		keys = append(keys, dataloader.StringKey(e.ID))
	}

	return keys
}

func hasPostChanged(n *post.Post, o *post.Post) bool {
	return n.Title != o.Title || n.URL != o.URL || n.TextContent != o.TextContent || n.HTMLContent != o.HTMLContent || !isSameTime(n.PublishedAt, o.PublishedAt) || !isSameTime(n.ModifiedAt, o.ModifiedAt)
}

func isSameTime(a pq.NullTime, b pq.NullTime) bool {
	if !a.Valid {
		return !b.Valid
	}

	if !b.Valid {
		return false
	}

	return a.Time.Equal(b.Time)
}

func (srv *ImportService) createSubscriptionTweets(ctx context.Context, sub *feed.Subscription, posts []*post.Post) error {
	return nil
}
