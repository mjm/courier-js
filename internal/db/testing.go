package db

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/jmoiron/sqlx"
	"github.com/segmentio/ksuid"
	"github.com/stretchr/testify/assert"
)

// TestingDSN is a data source name that connects to the local testing database.
const TestingDSN = "dbname=courier_test sslmode=disable"

// NewTestingDB creates a new database connection pointed at the testing database.
func NewTestingDB() DB {
	return &tracingDB{DB: sqlx.MustOpen("postgres", TestingDSN)}
}

func CreateDynamoTable(ctx context.Context, dynamo dynamodbiface.DynamoDBAPI, name string) error {
	_, err := dynamo.CreateTableWithContext(ctx, &dynamodb.CreateTableInput{
		TableName: aws.String(name),
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String(PK),
				KeyType:       aws.String(dynamodb.KeyTypeHash),
			},
			{
				AttributeName: aws.String(SK),
				KeyType:       aws.String(dynamodb.KeyTypeRange),
			},
		},
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String(PK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(SK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(GSI1PK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(GSI1SK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(GSI2PK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
			{
				AttributeName: aws.String(GSI2SK),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
		},
		GlobalSecondaryIndexes: []*dynamodb.GlobalSecondaryIndex{
			{
				IndexName: aws.String(GSI1),
				KeySchema: []*dynamodb.KeySchemaElement{
					{
						AttributeName: aws.String(GSI1PK),
						KeyType:       aws.String(dynamodb.KeyTypeHash),
					},
					{
						AttributeName: aws.String(GSI1SK),
						KeyType:       aws.String(dynamodb.KeyTypeRange),
					},
				},
				ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
					ReadCapacityUnits:  aws.Int64(5),
					WriteCapacityUnits: aws.Int64(5),
				},
				Projection: &dynamodb.Projection{
					ProjectionType: aws.String(dynamodb.ProjectionTypeAll),
				},
			},
			{
				IndexName: aws.String(GSI2),
				KeySchema: []*dynamodb.KeySchemaElement{
					{
						AttributeName: aws.String(GSI2PK),
						KeyType:       aws.String(dynamodb.KeyTypeHash),
					},
					{
						AttributeName: aws.String(GSI2SK),
						KeyType:       aws.String(dynamodb.KeyTypeRange),
					},
				},
				ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
					ReadCapacityUnits:  aws.Int64(5),
					WriteCapacityUnits: aws.Int64(5),
				},
				Projection: &dynamodb.Projection{
					ProjectionType: aws.String(dynamodb.ProjectionTypeAll),
				},
			},
		},
		ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	})
	return err
}

type DynamoSuite struct {
	dynamo dynamodbiface.DynamoDBAPI
	cfg    DynamoConfig
}

func (ds *DynamoSuite) Dynamo() dynamodbiface.DynamoDBAPI {
	return ds.dynamo
}

func (ds *DynamoSuite) DynamoConfig() DynamoConfig {
	return ds.cfg
}

func (ds *DynamoSuite) SetupSuite() {
	sess := session.Must(session.NewSession(
		aws.NewConfig().
			WithEndpoint("http://localhost:8000").
			WithRegion("local").
			// WithLogLevel(aws.LogDebugWithHTTPBody).
			WithCredentials(credentials.NewStaticCredentials("test_id", "test_secret", ""))))
	ds.dynamo = WrapDynamo(dynamodb.New(sess))
	ds.cfg = DynamoConfig{TableName: "courier_test_" + ksuid.New().String()}
}

func (ds *DynamoSuite) SetupTest(ctx context.Context, assert *assert.Assertions) {
	assert.NoError(CreateDynamoTable(ctx, ds.dynamo, ds.cfg.TableName))
}

func (ds *DynamoSuite) TearDownTest(ctx context.Context, assert *assert.Assertions) {
	_, err := ds.dynamo.DeleteTableWithContext(ctx, &dynamodb.DeleteTableInput{
		TableName: aws.String(ds.cfg.TableName),
	})
	assert.NoError(err)
}
