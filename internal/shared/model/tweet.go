package model

import (
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
)

const (
	TypeTweet = "Tweet"

	ColTweets        = "Tweets"
	ColRetweetID     = "RetweetID"
	ColPostedAt      = "PostedAt"
	ColCanceledAt    = "CanceledAt"
	ColBody          = "Body"
	ColMediaURLs     = "MediaURLs"
	ColPostedTweetID = "PostedTweetID"
)

type TweetGroupID struct {
	UserID string `json:"userId"`
	PostID `json:"postId"`
}

func TweetGroupIDFromParts(userID string, feedID FeedID, itemID string) TweetGroupID {
	return TweetGroupID{
		UserID: userID,
		PostID: PostID{
			FeedID: feedID,
			ItemID: itemID,
		},
	}
}

func (id TweetGroupID) PrimaryKeyValues() (string, string) {
	pk := "USER#" + id.UserID
	sk := fmt.Sprintf("FEED#%s#TWEETGROUP#%s", id.FeedID, id.ItemID)
	return pk, sk
}

func (id TweetGroupID) PrimaryKey() map[string]*dynamodb.AttributeValue {
	pk, sk := id.PrimaryKeyValues()
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

type TweetGroup struct {
	ID           TweetGroupID
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

func NewTweetGroupFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*TweetGroup, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	sk := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 4)
	feedID, postID := sk[1], sk[3]

	tg := &TweetGroup{
		ID: TweetGroupID{
			UserID: userID,
			PostID: PostID{
				FeedID: FeedID(feedID),
				ItemID: postID,
			},
		},
	}

	t, err := ParseTime(aws.StringValue(attrs[ColCreatedAt].S))
	if err != nil {
		return nil, err
	}
	tg.CreatedAt = t

	if tweetsVal, ok := attrs[ColTweets]; ok {
		tg.Action = ActionTweet
		for _, val := range tweetsVal.L {
			tweet, err := NewTweetFromAttrs(val.M)
			if err != nil {
				return nil, err
			}

			tg.Tweets = append(tg.Tweets, tweet)
		}
	} else if retweetIDVal, ok := attrs[ColRetweetID]; ok {
		tg.Action = ActionRetweet
		tg.RetweetID = aws.StringValue(retweetIDVal.S)
	}

	if postedAtVal, ok := attrs[ColPostedAt]; ok {
		t, err := ParseTime(aws.StringValue(postedAtVal.S))
		if err != nil {
			return nil, err
		}
		tg.PostedAt = &t
		tg.Status = Posted
	} else if canceledAtVal, ok := attrs[ColCanceledAt]; ok {
		t, err := ParseTime(aws.StringValue(canceledAtVal.S))
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

func NewTweetFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Tweet, error) {
	t := new(Tweet)

	if bodyVal, ok := attrs[ColBody]; ok {
		t.Body = aws.StringValue(bodyVal.S)
	}
	if mediaVal, ok := attrs[ColMediaURLs]; ok {
		for _, val := range mediaVal.L {
			t.MediaURLs = append(t.MediaURLs, aws.StringValue(val.S))
		}
	}
	if postedIDVal, ok := attrs[ColPostedTweetID]; ok {
		t.PostedTweetID = aws.StringValue(postedIDVal.S)
	}

	return t, nil
}

func (tg TweetGroup) UserID() string {
	return tg.ID.UserID
}

func (tg TweetGroup) FeedID() FeedID {
	return tg.ID.FeedID
}

func (tg TweetGroup) ItemID() string {
	return tg.ID.ItemID
}

func (tg TweetGroup) PostID() PostID {
	return tg.ID.PostID
}
