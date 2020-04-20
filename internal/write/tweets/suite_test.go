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
	tweetRepo         *TweetRepository
	externalTweetRepo *ExternalTweetRepository
	userRepo          *UserRepository
}

func (suite *tweetsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.commandBus = write.NewCommandBus()
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}
	suite.eventBus.Notify(suite.eventCollector)

	suite.tweetRepo = NewTweetRepository(suite.db)
	// TODO external tweet repo
	// TODO user repo
	NewCommandHandler(
		suite.commandBus, suite.eventBus, nil, suite.tweetRepo, suite.externalTweetRepo,
		suite.userRepo, nil, nil)
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

func TestTweetsSuite(t *testing.T) {
	suite.Run(t, new(tweetsSuite))
}
