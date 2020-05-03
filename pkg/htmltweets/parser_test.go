package htmltweets

import (
	"fmt"
	"net/url"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParser(t *testing.T) {
	cases := []struct {
		name      string
		input     string
		body      string
		mediaURLs []string
	}{
		{
			name: "an empty string",
		},
		{
			name:  "a simple string",
			input: "This is a very simple tweet.",
			body:  "This is a very simple tweet.",
		},
		{
			name:  "paragraghs to empty lines",
			input: "<p>Paragraph 1</p><p>Paragraph 2</p>",
			body:  "Paragraph 1\n\nParagraph 2",
		},
		{
			name:  "br tags to linebreaks",
			input: "Some content<br>Some more content<br />This is it.",
			body:  "Some content\nSome more content\nThis is it.",
		},
		{
			name:  "a link to a URL at the end",
			input: `This is <a href="https://example.com/foo/bar">some #content.</a>`,
			body:  "This is some #content. https://example.com/foo/bar",
		},
		{
			name:  "multiple links in the order they appear",
			input: `This is <a href="https://example.com/foo/bar">some</a> <a href="http://example.com/bar">#content.</a>`,
			body:  "This is some #content. https://example.com/foo/bar http://example.com/bar",
		},
		{
			name:  "links to Twitter user profiles",
			input: `This reminds me of something <a href="https://twitter.com/example123">Example 123</a> said.`,
			body:  "This reminds me of something @example123 said.",
		},
		{
			name:  "blockquotes to regular quotes",
			input: "<p>Check this thing out:</p><blockquote>I said a thing</blockquote>",
			body:  "Check this thing out:\n\n“I said a thing”",
		},
		{
			name:  "html entities",
			input: "<p>I&#8217;m having a &#8220;great time&#8221;. Here's &lt;strong&gt;some html&lt;/strong&gt;",
			body:  "I’m having a “great time”. Here's <strong>some html</strong>",
		},
		{
			name:  "without trailing newlines",
			input: "<p>This is some text</p>\n",
			body:  "This is some text",
		},
		{
			name:      "image tags to media URLs",
			input:     `<p>Check it out!</p><p><img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg"></p>`,
			body:      "Check it out!",
			mediaURLs: []string{"https://example.com/foo.jpg", "https://example.com/bar.jpg"},
		},
		{
			name: "embedded tweets to URLs",
			input: `<p>And I&#8217;m sitting here with two level 117 characters.</p>
    <blockquote class="twitter-tweet" data-width="550" data-dnt="true">
    <p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/Methodgg?ref_src=twsrc%5Etfw">@Methodgg</a> on the world first clear of Mythic Uldir!!! <a href="https://t.co/iUCOwDbPYw">pic.twitter.com/iUCOwDbPYw</a></p>
    <p>&mdash; World of Warcraft (@Warcraft) <a href="https://twitter.com/Warcraft/status/1042485327267422208?ref_src=twsrc%5Etfw">September 19, 2018</a></p></blockquote>
    <p><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>`,
			body: "And I’m sitting here with two level 117 characters. https://twitter.com/Warcraft/status/1042485327267422208",
		},
		{
			name: "embedded YouTube videos to URLs",
			input: `<p>I think the Sims 4 episode of Monster Factory is my favorite of them all. Watching this just brings me so much joy.</p>
    <p><iframe width="480" height="270" src="https://www.youtube.com/embed/TamwFUUd9Yk?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`,
			body: "I think the Sims 4 episode of Monster Factory is my favorite of them all. Watching this just brings me so much joy. https://www.youtube.com/watch?v=TamwFUUd9Yk",
		},
		{
			name: "collapsing spacing",
			input: `
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
			body: `Spicy jalapeno meatloaf shoulder sirloin, cow frankfurter tail pork belly leberkas brisket chuck pancetta bresaola. Shankle chuck rump kielbasa burgdoggen. Filet mignon turkey doner t-bone bresaola, ribeye biltong. Shank biltong kevin pork pancetta frankfurter, turkey tongue pork loin doner turducken drumstick jerky boudin t-bone.

Pancetta shank boudin, tail corned beef tenderloin kevin buffalo sausage tri-tip. T-bone landjaeger porchetta corned beef. Spare ribs strip steak bresaola ham pancetta prosciutto. T-bone turkey fatback, turducken pork pig cow jerky short loin ball tip. Boudin ball tip brisket, shankle chuck ham frankfurter hamburger buffalo landjaeger.`,
		},
		{
			name: "unordered lists to Unicode bullets",
			input: `<p>This is a list of things:</p>
    <ul>
    <li>This is the first thing</li>
    <li>This is the second thing</li>
    <li>This is the third thing</li>
    </ul>
    <p>And this is the rest.</p>`,
			body: `This is a list of things:

• This is the first thing
• This is the second thing
• This is the third thing

And this is the rest.`,
		},
		{
			name: "ordered lists to numbered lines",
			input: `<p>This is a list of things:</p>
    <ol>
    <li>This is the first thing</li>
    <li>This is the second thing</li>
    <li>This is the third thing</li>
    </ol>
    <ol>
    <li>This is a second list</li>
    </ol>`,
			body: `This is a list of things:

1. This is the first thing
2. This is the second thing
3. This is the third thing

1. This is a second list`,
		},
		{
			name: "relative URLs using the base URL",
			input: `
<p>This is <a href="/foo/bar">a relative link</a>.</p>
<figure><img src="/baz.jpg"></figure>`,
			body:      "This is a relative link. https://example.org/foo/bar",
			mediaURLs: []string{"https://example.org/baz.jpg"},
		},
		{
			name: "preformatted code block",
			input: `
<pre><code>alias fixit='git commit -a --amend -C HEAD'
alias shipit='git push --force-with-lease'
fixit && shipit</code></pre>
`,
			body: `alias fixit='git commit -a --amend -C HEAD'
alias shipit='git push --force-with-lease'
fixit && shipit`,
		},
		{
			name: "code block between paragraphs",
			input: `
<p>Paragraph
1.</p>
<pre><code>alias fixit='git commit -a --amend -C HEAD'
alias shipit='git push --force-with-lease'
fixit && shipit</code></pre>
<p>
Paragraph
2</p>
`,
			body: `Paragraph 1.

alias fixit='git commit -a --amend -C HEAD'
alias shipit='git push --force-with-lease'
fixit && shipit

Paragraph 2`,
		},
	}

	u, err := url.Parse("https://example.org/")
	assert.NoError(t, err)

	for _, c := range cases {
		t.Run(fmt.Sprintf("converts %s", c.name), func(t *testing.T) {
			p := &parser{baseURL: u}
			res, err := p.parse(strings.NewReader(c.input))
			assert.NoError(t, err)
			assert.Equal(t, c.body, res.body)
			assert.Equal(t, c.mediaURLs, res.mediaURLs)
		})
	}
}
