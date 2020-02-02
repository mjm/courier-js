package service

import (
	"context"
	"database/sql"
	"net/url"
	"strconv"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/loaders"
	"github.com/mjm/courier-js/internal/models/event"
	"github.com/mjm/courier-js/internal/models/feed"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/pkg/locatefeed"
	"github.com/mjm/courier-js/pkg/scraper"
)

type FeedService struct {
	db *db.DB
}

func NewFeedService(db *db.DB) *FeedService {
	return &FeedService{
		db: db,
	}
}

// Subscribe adds a new subscription to a feed for the current user. Subscribing also imports
// posts for the feed and creates tweets for the subscription.
func (srv *FeedService) Subscribe(ctx context.Context, feedURL string) (*feed.Subscription, error) {
	ctx = trace.Start(ctx, "Subscribe to feed")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "feed.url", feedURL)

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}
	trace.AddField(ctx, "user_id", userID)

	u, err := url.Parse(feedURL)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	u, err = locateFeed(ctx, u)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	trace.AddField(ctx, "feed.resolved_url", u.String())

	f, err := feed.ByURL(ctx, srv.db, u.String())
	if err == sql.ErrNoRows {
		f, err = feed.Create(ctx, srv.db, u.String())
		// TODO refresh feed
	}
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	trace.AddField(ctx, "feed.id", f.ID)

	l := loaders.Get(ctx)
	key := loader.IntKey(f.ID)
	l.Feeds.Clear(ctx, key).Prime(ctx, key, f)

	sub, err := feed.CreateSubscription(ctx, srv.db, userID, f.ID)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	trace.AddField(ctx, "feed.subscription_id", sub.ID)
	key = loader.IntKey(sub.ID)
	l.FeedSubscriptions.Clear(ctx, key).Prime(ctx, key, sub)

	event.Record(ctx, srv.db, event.FeedSubscribe, event.Params{
		FeedID:             strconv.Itoa(f.ID),
		FeedSubscriptionID: strconv.Itoa(sub.ID),
	})

	// TODO import recent posts
	return sub, nil
}

func locateFeed(ctx context.Context, u *url.URL) (*url.URL, error) {
	ctx = trace.Start(ctx, "Locate feed")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "feed.url", u.String())

	u, err := locatefeed.Locate(ctx, u)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return u, nil
}

// Unsubscribe removes a feed subscription from the user's account.
func (srv *FeedService) Unsubscribe(ctx context.Context, id int) error {
	ctx = trace.Start(ctx, "Unsubscribe from feed")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "feed.subscription_id", id)

	userID, err := auth.GetUser(ctx).ID()
	if err != nil {
		trace.Error(ctx, err)
		return err
	}
	trace.AddField(ctx, "user_id", userID)

	if err := feed.DeleteSubscription(ctx, srv.db, userID, id); err != nil {
		trace.Error(ctx, err)
		return err
	}

	event.Record(ctx, srv.db, event.FeedUnsubscribe, event.Params{
		FeedSubscriptionID: strconv.Itoa(id),
	})
	return nil
}

func (srv *FeedService) Refresh(ctx context.Context, id int, force bool) (*feed.Feed, error) {
	ctx = trace.Start(ctx, "Refresh feed")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"feed.id":            id,
		"feed.force_refresh": force,
	})

	l := loaders.Get(ctx)
	v, err := l.Feeds.Load(ctx, loader.IntKey(id))()
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}
	f := v.(*feed.Feed)

	var headers *scraper.CachingHeaders
	if !force && f.CachingHeaders != nil {
		headers.Etag = f.CachingHeaders.Etag
		headers.LastModified = f.CachingHeaders.LastModified
	}
	scraped, err := scrapeFeed(ctx, f.URL, headers)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	if scraped == nil {
		trace.AddField(ctx, "feed.up_to_date", true)
		return f, nil
	}
	trace.AddField(ctx, "feed.up_to_date", false)

	// TODO import posts

	// TODO get micropub endpoint

	f.Title = scraped.Title
	f.HomePageURL = scraped.HomePageURL
	f.CachingHeaders = &feed.CachingHeaders{
		Etag:         scraped.CachingHeaders.Etag,
		LastModified: scraped.CachingHeaders.LastModified,
	}
	// TODO MPEndpoint
	f, err = feed.Update(ctx, srv.db, f)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	// TODO find the subscription for the current user and record its ID in the event
	event.Record(ctx, srv.db, event.FeedRefresh, event.Params{FeedID: strconv.Itoa(f.ID)})

	return f, nil
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
