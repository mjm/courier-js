package feeds

import (
	"context"
	"net/url"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/net/context/ctxhttp"
	"willnorris.com/go/microformats"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/internal/write/shared"
	"github.com/mjm/courier-js/pkg/scraper"
)

// RefreshCommand is a request to refresh a feed's contents and create/update
// posts for the feed.
type RefreshCommand struct {
	UserID   string
	FeedID   model.FeedID
	Force    bool
	TaskName string
}

var (
	upToDateKey = kv.Key("feed.up_to_date").Bool
	skippedKey  = kv.Key("task.skipped").Bool
)

func (h *CommandHandler) handleRefresh(ctx context.Context, cmd RefreshCommand) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		keys.UserID(cmd.UserID),
		keys.FeedID(cmd.FeedID),
		keys.TaskName(cmd.TaskName),
		kv.Bool("feed.force_refresh", cmd.Force))

	f, err := h.feedRepo.Get(ctx, cmd.UserID, cmd.FeedID)
	if err != nil {
		return err
	}

	span.SetAttributes(kv.String("feed.expected_task_name", f.RefreshTaskName))

	if cmd.TaskName != "" && f.RefreshTaskName != cmd.TaskName {
		span.SetAttributes(skippedKey(true))
		return nil
	}
	span.SetAttributes(skippedKey(false))

	var headers *scraper.CachingHeaders
	if !cmd.Force && f.CachingHeaders != nil {
		headers = &scraper.CachingHeaders{
			Etag:         f.CachingHeaders.Etag,
			LastModified: f.CachingHeaders.LastModified,
		}
	}

	u, err := url.Parse(f.URL)
	if err != nil {
		return err
	}

	scraped, err := scraper.Scrape(ctx, u, headers)
	if err != nil {
		return err
	}

	if scraped == nil {
		span.SetAttributes(upToDateKey(true))

		// this updates the refreshed at time and clears the refresh task
		p := shared.UpdateFeedParams{
			ID:               f.ID,
			UserID:           f.UserID,
			Title:            f.Title,
			HomePageURL:      f.HomePageURL,
			CachingHeaders:   f.CachingHeaders,
			MicropubEndpoint: f.MicropubEndpoint,
		}
		if err := h.feedRepo.UpdateDetails(ctx, p); err != nil {
			return err
		}

		h.events.Fire(ctx, feeds.FeedRefreshed{
			FeedId: string(f.ID),
			UserId: cmd.UserID,
		})

		return nil
	}
	span.SetAttributes(upToDateKey(false))

	_, err = h.bus.Run(ctx, ImportPostsCommand{
		UserID:  f.UserID,
		FeedID:  f.ID,
		Entries: scraped.Entries,
	})
	if err != nil {
		return err
	}

	mpEndpoint, err := getMicropubEndpoint(ctx, scraped.HomePageURL)
	if err != nil {
		return err
	}

	p := shared.UpdateFeedParams{
		ID:          f.ID,
		UserID:      f.UserID,
		Title:       scraped.Title,
		HomePageURL: scraped.HomePageURL,
		CachingHeaders: &model.CachingHeaders{
			Etag:         scraped.CachingHeaders.Etag,
			LastModified: scraped.CachingHeaders.LastModified,
		},
		MicropubEndpoint: mpEndpoint,
	}
	if err = h.feedRepo.UpdateDetails(ctx, p); err != nil {
		return err
	}

	h.events.Fire(ctx, feeds.FeedRefreshed{
		FeedId: string(f.ID),
		UserId: cmd.UserID,
	})

	return nil
}

func getMicropubEndpoint(ctx context.Context, urlStr string) (string, error) {
	ctx, span := tracer.Start(ctx, "getMicropubEndpoint",
		trace.WithAttributes(kv.String("url", urlStr)))
	defer span.End()

	u, err := url.Parse(urlStr)
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	res, err := ctxhttp.Get(ctx, nil, u.String())
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}
	defer res.Body.Close()

	data := microformats.Parse(res.Body, u)
	micropubs, ok := data.Rels["micropub"]
	if !ok {
		return "", nil
	}

	span.SetAttributes(kv.Int("microformats.micropub_count", len(micropubs)))

	if len(micropubs) == 0 {
		return "", nil
	}

	return micropubs[0], nil
}
