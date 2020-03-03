package htmltweets

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"
)

type Input struct {
	Title string
	URL   string
	HTML  string
}

type Tweet struct {
	Action    Action
	Body      string
	MediaURLs []string
	RetweetID string
}

type Action string

const (
	ActionTweet   Action = "tweet"
	ActionRetweet Action = "retweet"
)

func Translate(input Input) ([]Tweet, error) {
	if input.Title != "" {
		return []Tweet{
			{
				Action: ActionTweet,
				Body:   fmt.Sprintf("%s %s", input.Title, input.URL),
			},
		}, nil
	}

	u, err := url.Parse(input.URL)
	if err != nil {
		return nil, err
	}

	p := &parser{baseURL: u}
	res, err := p.parse(strings.NewReader(input.HTML))
	if err != nil {
		return nil, err
	}

	tweets := split(res)
	if len(tweets) == 1 {
		if retweetID := extractRetweetID(tweets[0]); retweetID != "" {
			return []Tweet{
				{
					Action:    ActionRetweet,
					RetweetID: retweetID,
				},
			}, nil
		}
	}

	return tweets, nil
}

var tweetRegex = regexp.MustCompile("^https?://(?:www\\.)?twitter\\.com/[A-Za-z0-9_]+/status/([0-9]+)/?$")

func extractRetweetID(tweet Tweet) string {
	if len(tweet.MediaURLs) > 0 {
		return ""
	}

	if match := tweetRegex.FindStringSubmatch(tweet.Body); match != nil {
		return match[1]
	}
	return ""
}
