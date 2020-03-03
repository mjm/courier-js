package scraper

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

type jsonFeed struct {
	Version     string         `json:"version"`
	Title       string         `json:"title"`
	HomePageURL string         `json:"home_page_url"`
	Items       []jsonFeedItem `json:"items"`
}

type jsonFeedItem struct {
	ID            interface{} `json:"id"`
	URL           string      `json:"url"`
	Title         string      `json:"title"`
	ContentText   string      `json:"content_text"`
	ContentHTML   string      `json:"content_html"`
	DatePublished string      `json:"date_published"`
	DateModified  string      `json:"date_modified"`
}

func parseJSONFeed(ctx context.Context, res *http.Response) (*Feed, error) {
	defer res.Body.Close()

	var feed jsonFeed
	if err := json.NewDecoder(res.Body).Decode(&feed); err != nil {
		return nil, err
	}

	var f Feed
	f.Title = feed.Title
	f.HomePageURL = NormalizeURL(feed.HomePageURL)

	for _, item := range feed.Items {
		var entry Entry
		entry.ID = parseItemID(item.ID)
		entry.URL = item.URL
		entry.Title = item.Title
		entry.TextContent = item.ContentText
		entry.HTMLContent = item.ContentHTML

		if item.DatePublished != "" {
			t, err := time.Parse(time.RFC3339, item.DatePublished)
			if err != nil {
				return nil, err
			}
			t = t.UTC()
			entry.PublishedAt = &t
		}

		if item.DateModified != "" {
			t, err := time.Parse(time.RFC3339, item.DateModified)
			if err != nil {
				return nil, err
			}
			t = t.UTC()
			entry.ModifiedAt = &t
		}

		f.Entries = append(f.Entries, &entry)
	}

	return &f, nil
}

func parseItemID(v interface{}) string {
	switch v := v.(type) {
	case string:
		return v
	case int:
		return strconv.Itoa(v)
	case float64:
		return fmt.Sprintf("%.0f", v)
	}

	return ""
}
