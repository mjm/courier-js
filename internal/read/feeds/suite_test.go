package feeds

import (
	"testing"

	"github.com/jonboulle/clockwork"
	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/internal/write/shared"
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
	suite.feedQueries = NewFeedQueries(suite.db).(*feedQueries)
	suite.feedRepo = feeds.NewFeedRepository(suite.db)
	suite.subQueries = NewSubscriptionQueries(suite.db).(*subscriptionQueries)
	suite.subRepo = feeds.NewSubscriptionRepository(suite.db)
	suite.postQueries = NewPostQueries(suite.db).(*postQueries)
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

func init() {
	trace.InitForTesting()
}

type dynamoSuite struct {
	suite.Suite
	trace.TracingSuite
	db.DynamoSuite

	clock       clockwork.FakeClock
	feedRepo    *shared.FeedRepository
	feedQueries *FeedQueriesDynamo
}

func (suite *dynamoSuite) SetupSuite() {
	suite.TracingSuite.SetupSuite(suite)
	suite.DynamoSuite.SetupSuite()

	suite.clock = clockwork.NewFakeClock()
	suite.feedRepo = shared.NewFeedRepository(suite.Dynamo(), suite.DynamoConfig(), suite.clock)
	suite.feedQueries = NewFeedQueriesDynamo(suite.Dynamo(), suite.DynamoConfig())
}

func (suite *dynamoSuite) SetupTest() {
	suite.TracingSuite.SetupTest(suite)
	suite.DynamoSuite.SetupTest(suite.Ctx(), suite.Assert())
}

func (suite *dynamoSuite) TearDownTest() {
	suite.DynamoSuite.TearDownTest(suite.Ctx(), suite.Assert())
	suite.TracingSuite.TearDownTest()
}

func (suite *dynamoSuite) TearDownSuite() {
	suite.TracingSuite.TearDownSuite()
}

func TestFeedsDynamoSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
