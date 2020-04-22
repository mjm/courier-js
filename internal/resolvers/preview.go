package resolvers

import (
	"net/url"
	"strings"

	"github.com/mjm/courier-js/pkg/htmltweets"
	"github.com/mjm/courier-js/pkg/scraper"
)

type FeedPreview struct {
	q   Queries
	url *url.URL
	sf  *scraper.Feed
}

func (fp *FeedPreview) URL() string {
	return fp.url.String()
}

func (fp *FeedPreview) Title() string {
	return fp.sf.Title
}

func (fp *FeedPreview) HomePageURL() string {
	return fp.sf.HomePageURL
}

func (fp *FeedPreview) Tweets() ([]*TweetPreview, error) {
	var previews []*TweetPreview

	entries := fp.sf.Entries
	if len(fp.sf.Entries) > 5 {
		entries = entries[:5]
	}

	for _, entry := range entries {
		translated, err := htmltweets.Translate(htmltweets.Input{
			Title: entry.Title,
			URL:   entry.URL,
			HTML:  entry.HTMLContent,
		})
		if err != nil {
			return nil, err
		}

		for i := len(translated) - 1; i >= 0; i-- {
			t := translated[i]
			previews = append(previews, &TweetPreview{tweet: t})
		}
	}

	return previews, nil
}

type TweetPreview struct {
	tweet htmltweets.Tweet
}

func (tp *TweetPreview) Action() string {
	return strings.ToUpper(string(tp.tweet.Action))
}

func (tp *TweetPreview) Body() string {
	return tp.tweet.Body
}

func (tp *TweetPreview) MediaURLs() []string {
	return tp.tweet.MediaURLs
}

func (tp *TweetPreview) RetweetID() string {
	return tp.tweet.RetweetID
}
