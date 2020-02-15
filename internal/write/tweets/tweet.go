package tweets

import (
	"time"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

// Tweet is a single tweet that was translated from a post for a particular user.
type Tweet struct {
	ID                 TweetID            `db:"guid"`
	PostID             PostID             `db:"post_guid"`
	FeedSubscriptionID FeedSubscriptionID `db:"feed_subscription_guid"`
	Body               string             `db:"body"`
	MediaURLs          pq.StringArray     `db:"media_urls"`
	Status             TweetStatus        `db:"status"`
	PostedAt           pq.NullTime        `db:"posted_at"`
	PostedTweetID      string             `db:"posted_tweet_id"`
	Position           int                `db:"position"`
	CreatedAt          time.Time          `db:"created_at"`
	UpdatedAt          time.Time          `db:"updated_at"`
	PostAfter          pq.NullTime        `db:"post_after"`
	Action             TweetAction        `db:"action"`
	RetweetID          string             `db:"retweet_id"`

	Unused_ID                 int  `db:"id"`
	Unused_PostID             *int `db:"post_id"`
	Unused_FeedSubscriptionID *int `db:"feed_subscription_id"`
}

type TweetID = tweets.TweetID

// TweetStatus is a state that a tweet can be in.
type TweetStatus string

const (
	// Draft is a tweet that can be posted, either manually or automatically.
	Draft TweetStatus = "draft"
	// Canceled is a tweet that the user has opted not to post.
	Canceled TweetStatus = "canceled"
	// Posted is a tweet that has been posted to Twitter.
	Posted TweetStatus = "posted"
)

// TweetAction is the Twitter action that a tweet will perform when posted to Twitter.
type TweetAction string

const (
	// ActionTweet means that posting will cause a new tweet with the body text to be posted.
	ActionTweet TweetAction = "tweet"
	// ActionRetweet means that posting will cause another user's tweet to be retweeted.
	ActionRetweet TweetAction = "retweet"
)
