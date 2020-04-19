package feeds

import (
	"github.com/google/uuid"
)

type FeedID string

func NewFeedID() FeedID {
	return FeedID(uuid.New().String())
}

func (id FeedID) String() string {
	return string(id)
}

type SubscriptionID string

func NewSubscriptionID() SubscriptionID {
	return SubscriptionID(uuid.New().String())
}

func (id SubscriptionID) String() string {
	return string(id)
}

type PostID string

func NewPostID() PostID {
	return PostID(uuid.New().String())
}

func (id PostID) String() string {
	return string(id)
}
