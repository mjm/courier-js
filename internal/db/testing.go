package db

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/jmoiron/sqlx"
)

// TestingDSN is a data source name that connects to the local testing database.
const TestingDSN = "dbname=courier_test sslmode=disable"

// NewTestingDB creates a new database connection pointed at the testing database.
func NewTestingDB() DB {
	return &tracingDB{DB: sqlx.MustOpen("postgres", TestingDSN)}
}

func CreateDynamoTable(dynamo dynamodbiface.DynamoDBAPI, name string) error {
	_, err := dynamo.CreateTable(&dynamodb.CreateTableInput{
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
		},
		ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	})
	return err
}
