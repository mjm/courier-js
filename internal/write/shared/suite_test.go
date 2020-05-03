package shared

import (
	"testing"

	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/trace"
)

type dynamoSuite struct {
	suite.Suite
	trace.TracingSuite
	db.DynamoSuite

	clock     clockwork.FakeClock
	feedRepo  *FeedRepository
	postRepo  *PostRepository
	tweetRepo *TweetRepository
}

func init() {
	trace.InitForTesting()
}

func (suite *dynamoSuite) SetupSuite() {
	suite.TracingSuite.SetupSuite(suite)
	suite.DynamoSuite.SetupSuite()

	suite.clock = clockwork.NewFakeClock()
	suite.feedRepo = NewFeedRepository(suite.Dynamo(), suite.DynamoConfig(), suite.clock)
	suite.postRepo = NewPostRepository(suite.Dynamo(), suite.DynamoConfig(), suite.clock)
	suite.tweetRepo = NewTweetRepository(suite.Dynamo(), suite.DynamoConfig(), suite.clock)
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

func TestSharedSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
