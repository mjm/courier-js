package htmltweets

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTranslate(t *testing.T) {
	tests := []struct {
		name   string
		input  Input
		result []Tweet
	}{
		{
			name: "translates titled post",
			input: Input{
				Title: "Welcome to Microblogging",
				URL:   "https://example.com/abc/",
				HTML:  "Who cares?",
			},
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "Welcome to Microblogging https://example.com/abc/",
				},
			},
		},
		{
			name: "translates short microblog post",
			input: Input{
				URL:  "https://example.com/abc/",
				HTML: "This is a simple <em>tweet</em>.",
			},
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "This is a simple tweet.",
				},
			},
		},
		{
			name: "translates a microblog post with images",
			input: Input{
				URL:  "https://example.com/abc/",
				HTML: `<p>This is a tweet with media.</p><figure><img src="/foo.jpg"></figure>`,
			},
			result: []Tweet{
				{
					Action:    ActionTweet,
					Body:      "This is a tweet with media.",
					MediaURLs: []string{"https://example.com/foo.jpg"},
				},
			},
		},
		{
			name: "translates a long microblog post",
			input: Input{
				URL: "https://example.com/abc/",
				HTML: `
    <p>Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly
    leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen.
    Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin
    pork pancetta frankfurter, turkey tongue pork loin doner turducken drumstick
    jerky boudin t-bone.</p>
    <p>Pancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage
    tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola
    ham pancetta prosciutto. T-bone turkey fatback, turducken pork pig cow jerky
    short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter
    hamburger buffalo landjaeger.</p>
    `,
			},
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen. Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin pork pancetta frankfurter, turkey (1/3)",
				},
				{
					Action: ActionTweet,
					Body: `tongue pork loin doner turducken drumstick jerky boudin t-bone.

Pancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola ham pancetta prosciutto. T-bone turkey fatback, (2/3)`,
				},
				{
					Action: ActionTweet,
					Body:   "turducken pork pig cow jerky short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter hamburger buffalo landjaeger. (3/3)",
				},
			},
		},
		{
			name: "translates a retweet with a comment",
			input: Input{
				URL: "https://example.com/abc",
				HTML: `
    <p>And I&#8217;m sitting here with two level 117 characters.</p>
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
    `,
			},
			result: []Tweet{
				{
					Action: ActionTweet,
					Body:   "And I’m sitting here with two level 117 characters. https://twitter.com/Warcraft/status/1042485327267422208",
				},
			},
		},
		{
			name: "translates a retweet without comment",
			input: Input{
				URL: "https://example.com/abc",
				HTML: `
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
    `,
			},
			result: []Tweet{
				{
					Action:    ActionRetweet,
					RetweetID: "1042485327267422208",
				},
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result, err := Translate(test.input)
			assert.NoError(t, err)
			assert.Equal(t, test.result, result)
		})
	}
}
