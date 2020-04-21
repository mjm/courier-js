package model

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/segmentio/ksuid"

	"github.com/mjm/courier-js/internal/db"
)

const (
	TypeEvent = "Event"

	ColEventType = "EventType"
)

type EventID string

func NewEventID() EventID {
	return EventID(ksuid.New().String())
}

func NewEventIDWithTime(t time.Time) EventID {
	id, err := ksuid.NewRandomWithTime(t)
	if err != nil {
		panic(err)
	}
	return EventID(id.String())
}

type UserEventID struct {
	UserID  string
	EventID EventID
}

func (id UserEventID) PrimaryKeyValues() (string, string) {
	pk := "USEREVENTS#" + id.UserID
	sk := "EVENT#" + string(id.EventID)
	return pk, sk
}

func (id UserEventID) PrimaryKey() map[string]*dynamodb.AttributeValue {
	pk, sk := id.PrimaryKeyValues()
	return map[string]*dynamodb.AttributeValue{
		db.PK: {S: &pk},
		db.SK: {S: &sk},
	}
}

type Event struct {
	ID        EventID
	UserID    string
	EventType EventType
	CreatedAt time.Time

	Feed           *EventFeedInfo
	TweetGroup     *EventTweetInfo
	SubscriptionID string
}

// EventType is a distinct type of action that the event represents.
type EventType string

// Feed-related event types.
const (
	FeedRefresh     EventType = "feed_refresh"
	FeedSetAutopost EventType = "feed_set_autopost"
	FeedSubscribe   EventType = "feed_subscribe"
	FeedUnsubscribe EventType = "feed_unsubscribe"
)

// Tweet-related event types.
const (
	TweetCancel   EventType = "tweet_cancel"
	TweetUncancel EventType = "tweet_uncancel"
	TweetEdit     EventType = "tweet_edit"
	TweetPost     EventType = "tweet_post"
	TweetAutopost EventType = "tweet_autopost"
)

// Billing/subscription-related event types.
const (
	SubscriptionCreate     EventType = "subscription_create"
	SubscriptionRenew      EventType = "subscription_renew"
	SubscriptionCancel     EventType = "subscription_cancel"
	SubscriptionReactivate EventType = "subscription_reactivate"
	SubscriptionExpire     EventType = "subscription_expire"
)

type EventFeedInfo struct {
	ID       FeedID
	Title    string
	Autopost *bool
}

type EventTweetInfo struct {
	ID TweetGroupID
}

func NewEventFromAttrs(attrs map[string]*dynamodb.AttributeValue) (*Event, error) {
	userID := strings.SplitN(aws.StringValue(attrs[db.PK].S), "#", 2)[1]
	eventID := strings.SplitN(aws.StringValue(attrs[db.SK].S), "#", 2)[1]

	e := &Event{
		ID:        EventID(eventID),
		UserID:    userID,
		EventType: EventType(aws.StringValue(attrs[ColEventType].S)),
	}

	createdAt, err := ParseTime(aws.StringValue(attrs[ColCreatedAt].S))
	if err != nil {
		return nil, err
	}
	e.CreatedAt = createdAt

	return e, nil
}
