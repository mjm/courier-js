package feeds

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

type feedsSuite struct {
	suite.Suite
	db       db.DB
	eventBus *event.Bus

	feedQueries *feedQueries
	feedRepo    *feeds.FeedRepository

	subQueries *subscriptionQueries
	subRepo    *feeds.SubscriptionRepository

	postQueries *postQueries
	postRepo    *feeds.PostRepository
}

func (suite *feedsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.eventBus = event.NewBus()
	suite.feedQueries = NewFeedQueries(suite.db, suite.eventBus).(*feedQueries)
	suite.feedRepo = feeds.NewFeedRepository(suite.db)
	suite.subQueries = NewSubscriptionQueries(suite.db, suite.eventBus).(*subscriptionQueries)
	suite.subRepo = feeds.NewSubscriptionRepository(suite.db)
	suite.postQueries = NewPostQueries(suite.db, suite.eventBus).(*postQueries)
	suite.postRepo = feeds.NewPostRepository(suite.db)
}

func (suite *feedsSuite) SetupTest() {
	cleaner.Acquire("feeds", "feed_subscriptions")
}

func (suite *feedsSuite) TearDownTest() {
	cleaner.Clean("feeds", "feed_subscriptions")
}

func TestFeedsSuite(t *testing.T) {
	suite.Run(t, new(feedsSuite))
}
