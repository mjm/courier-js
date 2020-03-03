package tweets

import (
	"github.com/google/uuid"
)

type TweetID string

func NewTweetID() TweetID {
	return TweetID(uuid.New().String())
}

func (id TweetID) String() string {
	return string(id)
}
