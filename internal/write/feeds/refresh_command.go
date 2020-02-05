package feeds

import (
	"context"
	"net/url"

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
	FeedID int
	// Force causes scraping to ignore saved cache headers and always fetch and process
	// the full contents of the feed.
	Force bool
}

// HandleRefresh handles a request to refresh the contents of a feed.
func (h *CommandHandler) HandleRefresh(ctx context.Context, cmd RefreshCommand) error {
	trace.Add(ctx, trace.Fields{
		"user_id":            cmd.UserID,
		"feed.id":            cmd.FeedID,
		"feed.force_refresh": cmd.Force,
	})

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
		trace.AddField(ctx, "feed.up_to_date", true)
		return nil
	}
	trace.AddField(ctx, "feed.up_to_date", false)

	// TODO import posts

	// TODO get micropub endpoint

	p := UpdateFeedParams{
		ID:          f.ID,
		Title:       scraped.Title,
		HomePageURL: scraped.HomePageURL,
		CachingHeaders: &CachingHeaders{
			Etag:         scraped.CachingHeaders.Etag,
			LastModified: scraped.CachingHeaders.LastModified,
		},
		// TODO MPEndpoint
	}
	if err = h.feedRepo.Update(ctx, p); err != nil {
		return err
	}

	// TODO find the subscription for the current user and record its ID in the event
	// event.Record(ctx, srv.db, event.FeedRefresh, event.Params{FeedID: strconv.Itoa(f.ID)})

	return nil
}

func scrapeFeed(ctx context.Context, urlStr string, headers *scraper.CachingHeaders) (*scraper.Feed, error) {
	ctx = trace.Start(ctx, "Scrape feed")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "scrape.url", urlStr)
	if headers != nil {
		trace.Add(ctx, trace.Fields{
			"scrape.etag":          headers.Etag,
			"scrape.last_modified": headers.LastModified,
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
