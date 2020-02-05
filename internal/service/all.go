package service

import "github.com/google/wire"

// All is a provider set for every service defined in this package.
var All = wire.NewSet(
	NewTweetService,
)
