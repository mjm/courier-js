package tweets

import (
	"context"
	"errors"
	"time"

	"github.com/lib/pq"
	"github.com/mjm/courier-js/internal/db"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
)

// Tweet is a single tweet that was translated from a post for a particular user.
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

// TweetRepository fetches and stores information about tweets.
type TweetRepository struct {
	db db.DB
}

// NewTweetRepository creates a new tweet repository targeting a given database.
func NewTweetRepository(db db.DB) *TweetRepository {
	return &TweetRepository{db: db}
}

func (r *TweetRepository) ByPostIDs(ctx context.Context, subID int, postIDs []int) (map[int][]*Tweet, error) {
	rows, err := r.db.QueryxContext(ctx, `
		SELECT
			*
		FROM
			tweets
		WHERE feed_subscription_id = $1
			AND post_id = ANY($2)
		ORDER BY
			post_id,
			position
	`, subID, pq.Array(postIDs))
	if err != nil {
		return nil, err
	}

	byPostID := make(map[int][]*Tweet)
	for rows.Next() {
		var t Tweet
		if err := rows.StructScan(&t); err != nil {
			return nil, err
		}

		byPostID[t.PostID] = append(byPostID[t.PostID], &t)
	}
	return byPostID, nil
}

// Cancel marks a tweet as canceled as long as it is not already posted. It also clears
// the post_after field to prevent the tweet from being autoposted if it is uncanceled
// later.
func (r *TweetRepository) Cancel(ctx context.Context, userID string, tweetID int) error {
	res, err := r.db.ExecContext(ctx, `
		UPDATE
			tweets
		SET status = 'canceled',
				post_after = NULL,
				updated_at = CURRENT_TIMESTAMP
		FROM feed_subscriptions
		WHERE tweets.feed_subscription_id = feed_subscriptions.id
			AND feed_subscriptions.user_id = $1
			AND tweets.id = $2
			AND status <> 'posted'
	`, userID, tweetID)
	if err != nil {
		return err
	}

	n, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if n == 0 {
		return ErrNoTweet
	}

	return nil
}
