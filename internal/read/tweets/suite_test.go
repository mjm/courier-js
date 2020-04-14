package tweets

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write/shared"
)

type dynamoSuite struct {
	suite.Suite
	trace.TracingSuite
	db.DynamoSuite

	tweetRepo    *shared.TweetRepository
	tweetQueries *TweetQueriesDynamo
}

func init() {
	trace.InitForTesting()
}

func (suite *dynamoSuite) SetupSuite() {
	suite.TracingSuite.SetupSuite(suite)
	suite.DynamoSuite.SetupSuite()

	suite.tweetRepo = shared.NewTweetRepository(suite.Dynamo(), suite.DynamoConfig())
	suite.tweetQueries = NewTweetQueriesDynamo(suite.Dynamo(), suite.DynamoConfig())
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

func TestReadTweetsSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
