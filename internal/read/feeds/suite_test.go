package feeds

import (
	"testing"

	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/shared"
)

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
