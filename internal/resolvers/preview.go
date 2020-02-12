package resolvers

type FeedPreview struct {
}

func (fp *FeedPreview) URL() string {
	return ""
}

func (fp *FeedPreview) Title() string {
	return ""
}

func (fp *FeedPreview) HomePageURL() string {
	return ""
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
