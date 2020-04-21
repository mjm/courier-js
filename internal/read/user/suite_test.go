package user

import (
	"testing"

	"github.com/jonboulle/clockwork"
	"github.com/khaiql/dbcleaner"
	"github.com/khaiql/dbcleaner/engine"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/shared"
)

var cleaner = dbcleaner.New()

type userSuite struct {
	suite.Suite
	db             db.DB
	eventBus       *event.Bus
	eventCollector *event.Collector
}

func (suite *userSuite) SetupSuite() {
	suite.db = db.NewTestingDB()
	cleaner.SetEngine(engine.NewPostgresEngine(db.TestingDSN))
}

func (suite *userSuite) SetupTest() {
	suite.eventBus = event.NewBus()
	suite.eventCollector = &event.Collector{}
	suite.eventBus.Notify(suite.eventCollector)

	cleaner.Acquire("events")
}

func (suite *userSuite) TearDownTest() {
	cleaner.Clean("events")
}

func TestUserSuite(t *testing.T) {
	suite.Run(t, new(userSuite))
}

type dynamoSuite struct {
	suite.Suite
	trace.TracingSuite
	db.DynamoSuite

	clock        clockwork.FakeClock
	eventRepo    *shared.EventRepository
	eventQueries *EventQueries
}

func init() {
	trace.InitForTesting()
}

func (suite *dynamoSuite) SetupSuite() {
	suite.TracingSuite.SetupSuite(suite)
	suite.DynamoSuite.SetupSuite()

	suite.clock = clockwork.NewFakeClock()
	suite.eventRepo = shared.NewEventRepository(suite.Dynamo(), suite.DynamoConfig(), suite.clock)
	suite.eventQueries = NewEventQueries(suite.Dynamo(), suite.DynamoConfig())
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

func TestReadEventsSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
