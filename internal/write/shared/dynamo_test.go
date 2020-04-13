package shared

import (
	"context"
	"log"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/stretchr/testify/suite"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/db"
	mytrace "github.com/mjm/courier-js/internal/trace"
)

type dynamoSuite struct {
	suite.Suite
	Dynamo   dynamodbiface.DynamoDBAPI
	Ctx      context.Context
	suiteCtx context.Context

	feedRepo *FeedRepositoryDynamo
	postRepo *PostRepositoryDynamo
}

func init() {
	log.Println("Setting up tracing for tests")
	mytrace.InitForTesting()
}

func (suite *dynamoSuite) SetupSuite() {
	ctx, _ := tr.Start(context.Background(), suite.T().Name())
	suite.suiteCtx = ctx

	sess := session.Must(session.NewSession(
		aws.NewConfig().
			WithEndpoint("http://localhost:8000").
			WithRegion("local").
			// WithLogLevel(aws.LogDebugWithHTTPBody).
			WithCredentials(credentials.NewStaticCredentials("test_id", "test_secret", ""))))
	suite.Dynamo = db.WrapDynamo(dynamodb.New(sess))

	cfg := db.DynamoConfig{TableName: "courier_test"}
	suite.feedRepo = NewFeedRepositoryDynamo(suite.Dynamo, cfg)
	suite.postRepo = NewPostRepositoryDynamo(suite.Dynamo, cfg)
}

func (suite *dynamoSuite) SetupTest() {
	ctx, _ := tr.Start(suite.suiteCtx, suite.T().Name())
	suite.Ctx = ctx
	suite.NoError(db.CreateDynamoTable(ctx, suite.Dynamo, "courier_test"))
}

func (suite *dynamoSuite) TearDownTest() {
	_, err := suite.Dynamo.DeleteTableWithContext(suite.Ctx, &dynamodb.DeleteTableInput{
		TableName: aws.String("courier_test"),
	})
	suite.NoError(err)

	span := trace.SpanFromContext(suite.Ctx)
	span.End()
}

func (suite *dynamoSuite) TearDownSuite() {
	trace.SpanFromContext(suite.suiteCtx).End()
}

func TestSharedSuite(t *testing.T) {
	suite.Run(t, new(dynamoSuite))
}
