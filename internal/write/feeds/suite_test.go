package feeds

import (
	"testing"

	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
)

var cleaner = dbcleaner.New()

type feedsSuite struct {
	suite.Suite
	db       db.DB
	eventBus *event.Bus

	feedRepo *FeedRepository
	subRepo  *SubscriptionRepository
	postRepo *PostRepository
}

func (suite *feedsSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))

	suite.eventBus = event.NewBus()
	suite.feedRepo = NewFeedRepository(suite.db)
	suite.subRepo = NewSubscriptionRepository(suite.db)
	suite.postRepo = NewPostRepository(suite.db)
}

func (suite *feedsSuite) SetupTest() {
	cleaner.Acquire("feeds", "feed_subscriptions", "posts")
}

func (suite *feedsSuite) TearDownTest() {
	cleaner.Clean("feeds", "feed_subscriptions", "posts")
}

func TestFeedsSuite(t *testing.T) {
	suite.Run(t, new(feedsSuite))
}
