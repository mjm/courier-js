package tweets

import (
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write/feeds"
)

var cleaner = dbcleaner.New()

type tweetsSuite struct {
	suite.Suite
	db       db.DB
	eventBus *event.Bus

	feedRepo  *feeds.FeedRepository
	subRepo   *FeedSubscriptionRepository
	postRepo  *PostRepository
	tweetRepo *TweetRepository
}

func (suite *tweetsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.eventBus = event.NewBus()
	suite.subRepo = NewFeedSubscriptionRepository(suite.db)
	suite.postRepo = NewPostRepository(suite.db)
	suite.tweetRepo = NewTweetRepository(suite.db)
}

func (suite *tweetsSuite) SetupTest() {
	cleaner.Acquire("feeds", "feed_subscriptions", "posts", "tweets")
}

func (suite *tweetsSuite) TearDownTest() {
	cleaner.Clean("feeds", "feed_subscriptions", "posts", "tweets")
}

func TestTweetsSuite(t *testing.T) {
	suite.Run(t, new(tweetsSuite))
}
