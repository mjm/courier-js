package feeds

// FeedCreated occurs when a feed is initially created. This happens the first time any
// user subscribes to the feed.
type FeedCreated struct {
	FeedID FeedID
	URL    string
}

// FeedSubscribed occurs when a user subscribes to a feed.
type FeedSubscribed struct {
	FeedID         FeedID
	SubscriptionID SubscriptionID
	UserID         string
}

// FeedRefreshed occurs when a feed is refreshed. This may or may not be triggered by a
// user action.
type FeedRefreshed struct {
	FeedID FeedID
	UserID string
}

type FeedOptionsChanged struct {
	SubscriptionID SubscriptionID
	UserID         string
	Autopost       bool
}

type FeedUnsubscribed struct {
	SubscriptionID SubscriptionID
	UserID         string
}

// PostsImported occurs when posts are imported during a feed refresh. The posts
// referred to in PostIDs may have been created or updated.
type PostsImported struct {
	FeedID  FeedID
	PostIDs []PostID
}
