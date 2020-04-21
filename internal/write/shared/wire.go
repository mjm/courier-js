package shared

import (
	"github.com/google/wire"
	"github.com/jonboulle/clockwork"
)

var DefaultSet = wire.NewSet(
	NewEventRepository,
	NewFeedRepository,
	NewPostRepository,
	NewTweetRepository,
	clockwork.NewRealClock)
