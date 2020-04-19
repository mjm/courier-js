package feeds

import (
	"context"
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds/queries"
)

var cleaner = dbcleaner.New()

type feedsSuite struct {
	suite.Suite
	db             db.DB
	commandBus     *write.CommandBus
	eventBus       *event.Bus
	eventCollector *event.Collector

	feedRepo *FeedRepository
	subRepo  *SubscriptionRepository
	postRepo *PostRepository
}

func (suite *feedsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.commandBus = write.NewCommandBus()
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}
	suite.eventBus.Notify(suite.eventCollector)
	suite.feedRepo = NewFeedRepository(suite.db)
	suite.subRepo = NewSubscriptionRepository(suite.db)
	suite.postRepo = NewPostRepository(suite.db)

	NewCommandHandler(suite.commandBus, suite.eventBus, nil, suite.feedRepo, suite.subRepo, suite.postRepo,
		nil, nil)
}

func (suite *feedsSuite) SetupTest() {
	suite.eventCollector.Reset()

	cleaner.Acquire("feeds", "feed_subscriptions", "posts")
	_, err := suite.db.ExecContext(context.Background(), queries.FixturesExample)
	suite.NoError(err)
}

func (suite *feedsSuite) TearDownTest() {
	cleaner.Clean("feeds", "feed_subscriptions", "posts")
}

func TestFeedsSuite(t *testing.T) {
	suite.Run(t, new(feedsSuite))
}
