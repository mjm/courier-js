package htmltweets

import (
	"context"
	"fmt"
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

func Translate(ctx context.Context, input Input) ([]Tweet, error) {
	if input.Title != "" {
		return []Tweet{
			{
				Action: ActionTweet,
				Body:   fmt.Sprintf("%s %s", input.Title, input.URL),
			},
		}, nil
	}

	// TODO convert
	// TODO split

	return nil, nil
}
