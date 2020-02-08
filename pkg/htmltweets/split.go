package htmltweets

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/mjm/courier-js/pkg/twittertext"
)

func split(input *parseResult) []Tweet {
	contents := numberTweets(splitTweetText(input.body, nil))

	var tweets []Tweet
	for i, content := range contents {
		var mediaURLs []string
		if i == 0 {
			mediaURLs = input.mediaURLs
		}
		tweets = append(tweets, Tweet{
			Action:    ActionTweet,
			Body:      content,
			MediaURLs: mediaURLs,
		})
	}
	return tweets
}

func numberTweets(tweets []string) []string {
	total := len(tweets)
	if total <= 1 {
		return tweets
	}

	for i, t := range tweets {
		tweets[i] = fmt.Sprintf("%s (%d/%d)", t, i+1, total)
	}
	return tweets
}

func splitTweetText(text string, tweets []string) []string {
	first, rest := splitOnce(text)
	tweets = append(tweets, first)

	if rest != "" {
		return splitTweetText(rest, tweets)
	}

	return tweets
}

func splitOnce(text string) (string, string) {
	first := shorten(text)
	second := strings.TrimSpace(text[len(first):])
	return first, second
}

func shorten(text string) string {
	results := twittertext.Parse(text, twittertext.ConfigV3)
	if !results.Valid {
		text = dropWord(truncate(text, results))

		for {
			results = twittertext.Parse(fmt.Sprintf("%s (XX/XX)", text), twittertext.ConfigV3)
			if results.Valid {
				break
			}

			text = dropWord(text)
		}
	}

	return text
}

var dropWordRegex = regexp.MustCompile("\\s+\\S*$")

func dropWord(s string) string {
	return dropWordRegex.ReplaceAllLiteralString(s, "")
}

func truncate(text string, results twittertext.ParseResults) string {
	return text[results.ValidTextRange.Start:results.ValidTextRange.End]
}
