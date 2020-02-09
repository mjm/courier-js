package feedevent

// FeedCreated occurs when a feed is initially created. This happens the first time any
// user subscribes to the feed.
type FeedCreated struct {
	FeedID string
	URL    string
}

// FeedSubscribed occurs when a user subscribes to a feed.
type FeedSubscribed struct {
	FeedID         string
	SubscriptionID int
	UserID         string
}

// FeedRefreshed occurs when a feed is refreshed. This may or may not be triggered by a
// user action.
type FeedRefreshed struct {
	FeedID string
	UserID string
}

// PostsImported occurs when posts are imported during a feed refresh. The posts
// referred to in PostIDs may have been created or updated.
type PostsImported struct {
	FeedID  string
	PostIDs []int
}
