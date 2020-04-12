package db

const (
	PK = "PK"
	SK = "SK"

	GSI1   = "GSI1"
	GSI1PK = "GSI1PK"
	GSI1SK = "GSI1SK"
)

type DynamoConfig struct {
	TableName string `env:"DYNAMO_TABLE_NAME"`
}
