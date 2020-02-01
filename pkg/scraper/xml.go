package scraper

import (
	"context"
	"net/http"

	"github.com/mmcdole/gofeed"
)

func parseXMLFeed(ctx context.Context, res *http.Response) (*Feed, error) {
	defer res.Body.Close()

	fp := gofeed.NewParser()
	feed, err := fp.Parse(res.Body)
	if err != nil {
		return nil, err
	}

	var f Feed
	f.Title = feed.Title
	f.HomePageURL = normalizeURL(feed.Link)

	for _, item := range feed.Items {
		var entry Entry
		entry.ID = item.GUID
		if entry.ID == "" {
			entry.ID = item.Link
		}
		entry.URL = item.Link
		entry.Title = item.Title
		entry.HTMLContent = item.Content
		entry.TextContent = item.Description
		entry.PublishedAt = item.PublishedParsed
		entry.ModifiedAt = item.UpdatedParsed
		f.Entries = append(f.Entries, &entry)
	}

	return &f, nil
}
