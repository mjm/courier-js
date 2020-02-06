package tweetevent

// TweetCanceled occurs when a user cancels posting a draft tweet.
type TweetCanceled struct {
	UserID string
	TweetID int
}