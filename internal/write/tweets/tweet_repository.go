package tweets

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/HnH/qry"
	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

var (
	// ErrNoTweet is returned when a specific tweet cannot be found.
	ErrNoTweet = errors.New("no tweet found")
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

type TweetID string

func NewTweetID() TweetID {
	return TweetID(uuid.New().String())
}

func (id TweetID) String() string {
	return string(id)
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

func (r *TweetRepository) ByPostIDs(ctx context.Context, subID FeedSubscriptionID, postIDs []PostID) (map[PostID][]*Tweet, error) {
	rows, err := r.db.QueryxContext(ctx, queries.TweetsByPostIDs, subID, pq.Array(postIDs))
	if err != nil {
		return nil, err
	}

	byPostID := make(map[PostID][]*Tweet)
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
func (r *TweetRepository) Cancel(ctx context.Context, userID string, tweetID TweetID) error {
	res, err := r.db.ExecContext(ctx, queries.TweetsCancel, userID, tweetID)
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

type CreateTweetParams struct {
	ID        TweetID
	PostID    PostID
	Action    TweetAction
	Body      string
	MediaURLs []string
	RetweetID string
	Position  int
}

func (r *TweetRepository) Create(ctx context.Context, subID FeedSubscriptionID, autopost bool, ts []CreateTweetParams) error {
	if len(ts) == 0 {
		return nil
	}

	var postAfter pq.NullTime
	if autopost {
		postAfter.Valid = true
		postAfter.Time = time.Now().Add(5 * time.Minute)
	}

	emptyMediaURLs := []byte("[]")
	u := db.NewUnnester("uuid", "uuid", "tweet_action", "text", "json", "text", "int4")
	for _, t := range ts {
		mediaURLs := emptyMediaURLs
		if len(t.MediaURLs) > 0 {
			var err error
			mediaURLs, err = json.Marshal(t.MediaURLs)
			if err != nil {
				return err
			}
		}
		u.AppendRow(t.ID, t.PostID, t.Action, t.Body, mediaURLs, t.RetweetID, t.Position)
	}

	args := append([]interface{}{subID, postAfter}, u.Values()...)
	q := qry.Query(queries.TweetsCreate).Replace("__unnested__", u.UnnestFrom(3))
	_, err := r.db.ExecContext(ctx, string(q), args...)
	if err != nil {
		return err
	}

	return nil
}

type UpdateTweetParams struct {
	ID        TweetID
	Action    TweetAction
	Body      string
	MediaURLs []string
	RetweetID string
}

func (r *TweetRepository) Update(ctx context.Context, ts []UpdateTweetParams) error {
	// avoid a query if there are no values
	if len(ts) == 0 {
		return nil
	}

	emptyMediaURLs := []byte("[]")
	u := db.NewUnnester("uuid", "tweet_action", "text", "json", "text")
	for _, t := range ts {
		mediaURLs := emptyMediaURLs
		if len(t.MediaURLs) > 0 {
			var err error
			mediaURLs, err = json.Marshal(t.MediaURLs)
			if err != nil {
				return err
			}
		}
		u.AppendRow(t.ID, t.Action, t.Body, mediaURLs, t.RetweetID)
	}

	q := qry.Query(queries.TweetsUpdate).Replace("__unnested__", u.Unnest())
	_, err := r.db.ExecContext(ctx, string(q), u.Values()...)
	if err != nil {
		return err
	}

	return nil
}
