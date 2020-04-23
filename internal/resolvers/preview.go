package resolvers

import (
	"net/url"

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

func (fp *FeedPreview) Tweets() ([]*TweetGroupPreview, error) {
	var previews []*TweetGroupPreview

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

		preview := &TweetGroupPreview{}
		if translated[0].Action == htmltweets.ActionRetweet {
			preview.Action = "RETWEET"
			preview.RetweetID = translated[0].RetweetID
		} else {
			preview.Action = "TWEET"
			for _, t := range translated {
				preview.Tweets = append(preview.Tweets, &TweetPreview{tweet: t})
			}
		}

		previews = append(previews, preview)
	}

	return previews, nil
}

type TweetGroupPreview struct {
	Action    string
	RetweetID string
	Tweets    []*TweetPreview
}

type TweetPreview struct {
	tweet htmltweets.Tweet
}

func (tp *TweetPreview) Body() string {
	return tp.tweet.Body
}

func (tp *TweetPreview) MediaURLs() []string {
	return tp.tweet.MediaURLs
}

func (tp *TweetPreview) PostedTweetID() *string {
	return nil
}
