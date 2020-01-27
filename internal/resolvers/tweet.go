package resolvers

import (
	"strings"

	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/mjm/courier-js/internal/models/tweet"
)

type Tweet struct {
	tweet *tweet.Tweet
}

func (t *Tweet) ID() graphql.ID {
	return relay.MarshalID("twt", t.tweet.ID)
}

func (t *Tweet) Action() string {
	return strings.ToUpper(string(t.tweet.Action))
}

func (t *Tweet) Body() string {
	return t.tweet.Body
}

func (t *Tweet) MediaURLS() []string {
	return t.tweet.MediaURLs
}

func (t *Tweet) RetweetID() string {
	return t.tweet.RetweetID
}
