package resolvers

import (
	"github.com/mjm/courier-js/internal/read/feeds"
)

type FeedPreview struct {
	q    Queries
	feed *feeds.Feed
}

func (fp *FeedPreview) URL() string {
	return fp.feed.URL
}

func (fp *FeedPreview) Title() string {
	return fp.feed.Title
}

func (fp *FeedPreview) HomePageURL() string {
	return fp.feed.HomePageURL
}

func (fp *FeedPreview) Tweets() []*TweetPreview {
	return nil
}

type TweetPreview struct {
}

func (tp *TweetPreview) Action() string {
	return ""
}

func (tp *TweetPreview) Body() string {
	return ""
}

func (tp *TweetPreview) MediaURLs() []string {
	return nil
}

func (tp *TweetPreview) RetweetID() string {
	return ""
}
