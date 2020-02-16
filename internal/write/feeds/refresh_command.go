package feeds

import (
	"context"
	"net/url"

	"golang.org/x/net/context/ctxhttp"
	"willnorris.com/go/microformats"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/scraper"
)

// RefreshCommand is a request to refresh a feed's contents and create/update
// posts for the feed.
type RefreshCommand struct {
	// UserID is the user who initiated the command. A feed can be shared between users,
	// so sometimes a user can causes posts to be created that affect other users.
	//
	// The UserID may be empty if the refresh was triggered by an automated request
	// instead of a user action.
	UserID string
	// FeedID is the ID of the feed that should be refreshed.
	FeedID FeedID
	// Force causes scraping to ignore saved cache headers and always fetch and process
	// the full contents of the feed.
	Force bool
}

func (h *CommandHandler) handleRefresh(ctx context.Context, cmd RefreshCommand) error {
	trace.UserID(ctx, cmd.UserID)
	trace.FeedID(ctx, cmd.FeedID)
	trace.FeedForceRefresh(ctx, cmd.Force)

	f, err := h.feedRepo.Get(ctx, cmd.FeedID)
	if err != nil {
		return err
	}

	var headers *scraper.CachingHeaders
	if !cmd.Force && f.CachingHeaders != nil {
		headers = &scraper.CachingHeaders{
			Etag:         f.CachingHeaders.Etag,
			LastModified: f.CachingHeaders.LastModified,
		}
	}
	scraped, err := scrapeFeed(ctx, f.URL, headers)
	if err != nil {
		return err
	}

	if scraped == nil {
		trace.FeedUpToDate(ctx, true)
		return nil
	}
	trace.FeedUpToDate(ctx, false)

	_, err = h.bus.Run(ctx, ImportPostsCommand{
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

	p := UpdateFeedParams{
		ID:          f.ID,
		Title:       scraped.Title,
		HomePageURL: scraped.HomePageURL,
		CachingHeaders: &CachingHeaders{
			Etag:         scraped.CachingHeaders.Etag,
			LastModified: scraped.CachingHeaders.LastModified,
		},
		MPEndpoint: mpEndpoint,
	}
	if err = h.feedRepo.Update(ctx, p); err != nil {
		return err
	}

	h.eventBus.Fire(ctx, feeds.FeedRefreshed{
		FeedID: f.ID,
		UserID: cmd.UserID,
	})

	return nil
}

func scrapeFeed(ctx context.Context, urlStr string, headers *scraper.CachingHeaders) (*scraper.Feed, error) {
	ctx = trace.Start(ctx, "Scrape feed")
	defer trace.Finish(ctx)

	trace.FeedURL(ctx, urlStr)
	if headers != nil {
		trace.Add(ctx, trace.Fields{
			"feed.etag":          headers.Etag,
			"feed.last_modified": headers.LastModified,
		})
	}

	u, err := url.Parse(urlStr)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	feed, err := scraper.Scrape(ctx, u, headers)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return feed, nil
}

func getMicropubEndpoint(ctx context.Context, urlStr string) (string, error) {
	ctx = trace.Start(ctx, "Get Micropub endpoint")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "url", urlStr)

	u, err := url.Parse(urlStr)
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	res, err := ctxhttp.Get(ctx, nil, u.String())
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}
	defer res.Body.Close()

	data := microformats.Parse(res.Body, u)
	micropubs, ok := data.Rels["micropub"]
	if !ok {
		return "", nil
	}

	trace.AddField(ctx, "microformats.micropub_count", len(micropubs))

	if len(micropubs) == 0 {
		return "", nil
	}

	return micropubs[0], nil
}
