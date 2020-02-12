package tweetevent

// TweetCanceled occurs when a user cancels posting a draft tweet.
type TweetCanceled struct {
	UserID  string
	TweetID string
}

type TweetUncanceled struct {
	UserID  string
	TweetID string
}

type TweetEdited struct {
	UserID  string
	TweetID string
}

// TweetsCreated occurs when some tweets are created for a subscription by posts being
// imported.
type TweetsCreated struct {
	TweetsImported
}

// TweetsUpdated occurs when some tweets are updated for a subscription by posts being
// imported.
type TweetsUpdated struct {
	TweetsImported
}

// TweetsImported occurs when some tweets are created or updated for a subscription by
// posts being imported.
type TweetsImported struct {
	UserID         string
	SubscriptionID string
	TweetIDs       []string
}
