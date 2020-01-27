package tweet

import (
	"time"

	"github.com/lib/pq"
)

type Tweet struct {
	ID                 int            `db:"id"`
	PostID             int            `db:"post_id"`
	FeedSubscriptionID int            `db:"feed_subscription_id"`
	Body               string         `db:"body"`
	MediaURLs          pq.StringArray `db:"media_urls"`
	Status             TweetStatus    `db:"status"`
	PostedAt           pq.NullTime    `db:"posted_at"`
	PostedTweetID      string         `db:"posted_tweet_id"`
	Position           int            `db:"position"`
	CreatedAt          time.Time      `db:"created_at"`
	UpdatedAt          time.Time      `db:"updated_at"`
	PostAfter          pq.NullTime    `db:"post_after"`
	Action             TweetAction    `db:"action"`
	RetweetID          string         `db:"retweet_id"`
}

type TweetStatus string

const (
	Draft    TweetStatus = "draft"
	Canceled TweetStatus = "canceled"
	Posted   TweetStatus = "posted"
)

type TweetAction string

const (
	ActionTweet   TweetAction = "tweet"
	ActionRetweet TweetAction = "retweet"
)
