package resolvers

import (
	"context"
	"strings"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/read/tweets"
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

func (fp *FeedPreview) Tweets(ctx context.Context) ([]*TweetPreview, error) {
	conn, err := fp.q.Posts.Paged(ctx, fp.feed.ID, pager.First(10, nil))
	if err != nil {
		return nil, err
	}

	var previews []*TweetPreview
	for _, edge := range conn.Edges {
		p := edge.(*feeds.Post)
		ts, err := fp.q.Tweets.GeneratePreviews(ctx, tweets.PreviewPost{
			URL:         p.URL,
			Title:       p.Title,
			HTMLContent: p.HTMLContent,
		})
		if err != nil {
			return nil, err
		}

		for _, t := range ts {
			previews = append(previews, &TweetPreview{tweet: t})
		}
	}

	return previews, nil
}

type TweetPreview struct {
	tweet *tweets.PreviewTweet
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
