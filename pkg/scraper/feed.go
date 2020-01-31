package scraper

import "time"

type Feed struct {
	Title          string
	HomePageURL    string
	CachingHeaders CachingHeaders
	Entries        []*Entry
}

type CachingHeaders struct {
	Etag         string `json:"etag,omitempty"`
	LastModified string `json:"lastModified,omitempty"`
}

type Entry struct {
	ID          string
	Title       string
	URL         string
	TextContent string
	HTMLContent string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
}
