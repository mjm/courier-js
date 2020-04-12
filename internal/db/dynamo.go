package db

import (
	"context"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
)

const (
	PK = "PK"
	SK = "SK"

	GSI1   = "GSI1"
	GSI1PK = "GSI1PK"
	GSI1SK = "GSI1SK"
)

var (
	dbTypeDynamo   = key.String("db.type", "dynamodb")
	dbInstanceKey  = key.New("db.instance").String
	dbStatementKey = key.New("db.statement").String
)

type DynamoConfig struct {
	TableName string `env:"DYNAMO_TABLE_NAME"`
}

type DynamoDB struct {
	dynamodbiface.DynamoDBAPI
	real dynamodbiface.DynamoDBAPI
}

func WrapDynamo(real dynamodbiface.DynamoDBAPI) *DynamoDB {
	return &DynamoDB{real: real}
}

func (d *DynamoDB) BatchGetItemWithContext(ctx context.Context, input *dynamodb.BatchGetItemInput, opts ...request.Option) (*dynamodb.BatchGetItemOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.BatchGetItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	for table := range input.RequestItems {
		tables = append(tables, table)
	}

	span.SetAttributes(dbInstanceKey(strings.Join(tables, ", ")))

	out, err := d.real.BatchGetItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) BatchGetItemPagesWithContext(ctx context.Context, input *dynamodb.BatchGetItemInput, fn func(*dynamodb.BatchGetItemOutput, bool) bool, opts ...request.Option) error {
	ctx, span := tracer.Start(ctx, "dynamodb.BatchGetItemPages",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	for table := range input.RequestItems {
		tables = append(tables, table)
	}

	span.SetAttributes(dbInstanceKey(strings.Join(tables, ", ")))

	err := d.real.BatchGetItemPagesWithContext(ctx, input, fn, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return err
	}

	return nil
}

func (d *DynamoDB) BatchWriteItemWithContext(ctx context.Context, input *dynamodb.BatchWriteItemInput, opts ...request.Option) (*dynamodb.BatchWriteItemOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.BatchWriteItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	for table := range input.RequestItems {
		tables = append(tables, table)
	}

	span.SetAttributes(dbInstanceKey(strings.Join(tables, ", ")))

	out, err := d.real.BatchWriteItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) CreateTableWithContext(ctx context.Context, input *dynamodb.CreateTableInput, opts ...request.Option) (*dynamodb.CreateTableOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.CreateTable",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.CreateTableWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) DeleteTableWithContext(ctx context.Context, input *dynamodb.DeleteTableInput, opts ...request.Option) (*dynamodb.DeleteTableOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.DeleteTable",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.DeleteTableWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) GetItemWithContext(ctx context.Context, input *dynamodb.GetItemInput, opts ...request.Option) (*dynamodb.GetItemOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.GetItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.GetItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) PutItemWithContext(ctx context.Context, input *dynamodb.PutItemInput, opts ...request.Option) (*dynamodb.PutItemOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.PutItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.PutItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) QueryWithContext(ctx context.Context, input *dynamodb.QueryInput, opts ...request.Option) (*dynamodb.QueryOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.Query",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.QueryWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}

func (d *DynamoDB) UpdateItemWithContext(ctx context.Context, input *dynamodb.UpdateItemInput, opts ...request.Option) (*dynamodb.UpdateItemOutput, error) {
	ctx, span := tracer.Start(ctx, "dynamodb.UpdateItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	out, err := d.real.UpdateItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return out, nil
}
