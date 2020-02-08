package htmltweets

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSplit(t *testing.T) {
	tests := []struct {
		name      string
		body      string
		mediaURLs []string
		result    []Tweet
	}{
		{
			name: "too short to split",
			body: strings.Repeat("abcd ", 56),
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd ",
				},
			},
		},
		{
			name: "splits across word boundaries",
			body: strings.Repeat("abcd ", 57),
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd (1/2)",
				},
				{
					Action: ActionTweet,
					Body:   "abcd abcd abcd (2/2)",
				},
			},
		},
		{
			name:      "attaches all media URLs to the first tweet",
			body:      strings.Repeat("abcd ", 57),
			mediaURLs: []string{"https://example.com/foo.jpg", "https://example.com/bar.jpg"},
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd abcd (1/2)",
					MediaURLs: []string{
						"https://example.com/foo.jpg",
						"https://example.com/bar.jpg",
					},
				},
				{
					Action: ActionTweet,
					Body:   "abcd abcd abcd (2/2)",
				},
			},
		},
		{
			name: "splits bacon ipsum",
			body: `Bacon ipsum dolor amet andouille rump tongue flank leberkas tail shoulder picanha cupim turducken hamburger brisket. Bacon pastrami capicola, pork chop venison landjaeger rump swine doner kevin frankfurter chuck strip steak jerky. Pork belly kielbasa pork buffalo bresaola. Tenderloin fatback short ribs meatloaf. Meatloaf sausage biltong bacon turkey cow frankfurter. Frankfurter jerky drumstick doner, bacon sausage turducken alcatra pig fatback strip steak.`,
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "Bacon ipsum dolor amet andouille rump tongue flank leberkas tail shoulder picanha cupim turducken hamburger brisket. Bacon pastrami capicola, pork chop venison landjaeger rump swine doner kevin frankfurter chuck strip steak jerky. Pork belly kielbasa pork buffalo (1/2)",
				},
				{
					Action: ActionTweet,
					Body:   "bresaola. Tenderloin fatback short ribs meatloaf. Meatloaf sausage biltong bacon turkey cow frankfurter. Frankfurter jerky drumstick doner, bacon sausage turducken alcatra pig fatback strip steak. (2/2)",
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			tweets := split(&parseResult{
				body:      test.body,
				mediaURLs: test.mediaURLs,
			})
			assert.Equal(t, test.result, tweets)
		})
	}
}
