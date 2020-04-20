package tweets

import (
	"time"

	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/shared/tweets"
)

// Tweet is a single tweet that was translated from a post for a particular user.
type Tweet struct {
	ID                 tweets.TweetID       `db:"guid"`
	PostID             feeds.PostID         `db:"post_guid"`
	FeedSubscriptionID feeds.SubscriptionID `db:"feed_subscription_guid"`
	Body               string               `db:"body"`
	MediaURLs          pq.StringArray       `db:"media_urls"`
	Status             TweetStatus          `db:"status"`
	PostedAt           pq.NullTime          `db:"posted_at"`
	PostedTweetID      string               `db:"posted_tweet_id"`
	Position           int                  `db:"position"`
	CreatedAt          time.Time            `db:"created_at"`
	UpdatedAt          time.Time            `db:"updated_at"`
	PostAfter          pq.NullTime          `db:"post_after"`
	Action             TweetAction          `db:"action"`
	RetweetID          string               `db:"retweet_id"`
	PostTaskName       string               `db:"post_task_name"`

	Unused_ID                 int  `db:"id"`
	Unused_PostID             *int `db:"post_id"`
	Unused_FeedSubscriptionID *int `db:"feed_subscription_id"`
}

// TweetStatus is a state that a tweet can be in.
type TweetStatus string

// TweetAction is the Twitter action that a tweet will perform when posted to Twitter.
type TweetAction string
