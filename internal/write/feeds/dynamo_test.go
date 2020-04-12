package feeds

import (
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/stretchr/testify/suite"

	"github.com/mjm/courier-js/internal/db"
)

type dynamoSuite struct {
	suite.Suite
	dynamo dynamodbiface.DynamoDBAPI

	feedRepo *FeedRepositoryDynamo
	postRepo *PostRepositoryDynamo
}

func (suite *dynamoSuite) SetupSuite() {
	sess := session.Must(session.NewSession(
		aws.NewConfig().
			WithEndpoint("http://localhost:8000").
			WithRegion("local").
			// WithLogLevel(aws.LogDebugWithHTTPBody).
			WithCredentials(credentials.NewStaticCredentials("test_id", "test_secret", ""))))
	suite.dynamo = dynamodb.New(sess)

	cfg := db.DynamoConfig{TableName: "courier_test"}
	suite.feedRepo = NewFeedRepositoryDynamo(suite.dynamo, cfg)
	suite.postRepo = NewPostRepositoryDynamo(suite.dynamo, cfg)
}

func (suite *dynamoSuite) SetupTest() {
	suite.NoError(db.CreateDynamoTable(suite.dynamo, "courier_test"))
}

func (suite *dynamoSuite) TearDownTest() {
	_, err := suite.dynamo.DeleteTable(&dynamodb.DeleteTableInput{
		TableName: aws.String("courier_test"),
	})
	suite.NoError(err)
}

func TestFeedsDynamoSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
