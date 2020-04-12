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
}

func (suite *dynamoSuite) SetupTest() {
	_, err := suite.dynamo.CreateTable(&dynamodb.CreateTableInput{
		TableName: aws.String("courier_test"),
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String(db.PK),
				KeyType:       aws.String(dynamodb.KeyTypeHash),
			},
			{
				AttributeName: aws.String(db.SK),
				KeyType:       aws.String(dynamodb.KeyTypeRange),
			},
		},
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String(db.PK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(db.SK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
		},
		GlobalSecondaryIndexes: nil,
		ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	})
	suite.NoError(err)
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
