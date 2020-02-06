package tweets

import (
	"context"
	"errors"

	"github.com/mjm/courier-js/internal/db"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
)

// TweetRepository fetches and stores information about tweets.
type TweetRepository struct {
	db db.DB
}

// NewTweetRepository creates a new tweet repository targeting a given database.
func NewTweetRepository(db db.DB) *TweetRepository {
	return &TweetRepository{db: db}
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
		WHERE user_id = $1
			AND id = $2
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
