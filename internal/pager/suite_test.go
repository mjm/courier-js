package pager

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/trace"
)

type dynamoSuite struct {
	suite.Suite
	trace.TracingSuite
	db.DynamoSuite
}

func init() {
	trace.InitForTesting()
}

func (suite *dynamoSuite) SetupSuite() {
	suite.TracingSuite.SetupSuite(suite)
	suite.DynamoSuite.SetupSuite()
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

func TestPagerSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
