package shared

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/shared/feeds"
)

type TweetGroup struct {
	UserID       string
	FeedID       feeds.FeedID
	PostID       feeds.PostID
	Action       TweetAction
	Tweets       []*Tweet
	RetweetID    string
	Status       TweetStatus
	PostedAt     *time.Time
	CanceledAt   *time.Time
	PostAfter    *time.Time
	PostTaskName string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Tweet struct {
	Body          string
	MediaURLs     []string
	PostedTweetID string
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

func newTweetGroupFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*TweetGroup, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	sk := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 4)
	feedID, postID := sk[1], sk[3]

	tg := &TweetGroup{
		UserID: userID,
		FeedID: feeds.FeedID(feedID),
		PostID: feeds.PostID(postID),
	}

	t, err := time.Parse(time.RFC3339, aws.StringValue(attrs[colCreatedAt].S))
	if err != nil {
		return nil, err
	}
	tg.CreatedAt = t

	if tweetsVal, ok := attrs[colTweets]; ok {
		tg.Action = ActionTweet
		for _, val := range tweetsVal.L {
			tweet, err := newTweetFromAttrs(val.M)
			if err != nil {
				return nil, err
			}

			tg.Tweets = append(tg.Tweets, tweet)
		}
	} else if retweetIDVal, ok := attrs[colRetweetID]; ok {
		tg.Action = ActionRetweet
		tg.RetweetID = aws.StringValue(retweetIDVal.S)
	}

	if postedAtVal, ok := attrs[colPostedAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(postedAtVal.S))
		if err != nil {
			return nil, err
		}
		tg.PostedAt = &t
		tg.Status = Posted
	} else if canceledAtVal, ok := attrs[colCanceledAt]; ok {
		t, err := time.Parse(time.RFC3339, aws.StringValue(canceledAtVal.S))
		if err != nil {
			return nil, err
		}
		tg.CanceledAt = &t
		tg.Status = Canceled
	} else {
		tg.Status = Draft
	}

	// TODO post after and task name

	return tg, nil
}

func newTweetFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Tweet, error) {
	t := new(Tweet)

	if bodyVal, ok := attrs[colBody]; ok {
		t.Body = aws.StringValue(bodyVal.S)
	}
	if mediaVal, ok := attrs[colMediaURLs]; ok {
		for _, val := range mediaVal.L {
			t.MediaURLs = append(t.MediaURLs, aws.StringValue(val.S))
		}
	}
	if postedIDVal, ok := attrs[colPostedTweetID]; ok {
		t.PostedTweetID = aws.StringValue(postedIDVal.S)
	}

	return t, nil
}
