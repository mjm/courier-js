package tweets

import (
	"context"
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/tweets/queries"
)

var cleaner = dbcleaner.New()

type tweetsSuite struct {
	suite.Suite
	db             db.DB
	commandBus     *write.CommandBus
	eventBus       *event.Bus
	eventCollector *event.Collector

	feedRepo          *feeds.FeedRepository
	subRepo           *FeedSubscriptionRepository
	postRepo          *PostRepository
	tweetRepo         *TweetRepository
	externalTweetRepo *ExternalTweetRepository
}

func (suite *tweetsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.commandBus = write.NewCommandBus()
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}

	suite.subRepo = NewFeedSubscriptionRepository(suite.db)
	suite.postRepo = NewPostRepository(suite.db)
	suite.tweetRepo = NewTweetRepository(suite.db)
	// TODO external tweet repo
	NewCommandHandler(
		suite.commandBus, suite.eventBus, suite.tweetRepo, suite.subRepo, suite.postRepo, suite.externalTweetRepo)
}

func (suite *tweetsSuite) SetupTest() {
	suite.eventCollector.Reset()

	cleaner.Acquire("feeds", "feed_subscriptions", "posts", "tweets")
	_, err := suite.db.ExecContext(context.Background(), queries.FixturesExample)
	suite.NoError(err)
}

func (suite *tweetsSuite) TearDownTest() {
	cleaner.Clean("feeds", "feed_subscriptions", "posts", "tweets")
}

func (suite *tweetsSuite) collectEvents(types ...interface{}) {
	suite.eventBus.Notify(suite.eventCollector, types...)
}

func TestTweetsSuite(t *testing.T) {
	suite.Run(t, new(tweetsSuite))
}
