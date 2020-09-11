package db

import (
	"context"
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/config"
)

var DefaultSet = wire.NewSet(NewDynamoDB, NewDynamoConfig,
	wire.Bind(new(dynamodbiface.DynamoDBAPI), new(*DynamoDB)))

const (
	PK = "PK"
	SK = "SK"

	GSI1   = "GSI1"
	GSI1PK = "GSI1PK"
	GSI1SK = "GSI1SK"

	GSI2   = "GSI2"
	GSI2PK = "GSI2PK"
	GSI2SK = "GSI2SK"

	LSI1   = "LSI1"
	LSI1SK = "LSI1SK"

	Type = "Type"
)

type DynamoConfig struct {
	TableName string `env:"DYNAMO_TABLE_NAME" secret:"db/table-name"`
}

func NewDynamoConfig(l *config.Loader) (cfg DynamoConfig, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

type DynamoDB struct {
	dynamodbiface.DynamoDBAPI
	real dynamodbiface.DynamoDBAPI
}

func NewDynamoDB() (*DynamoDB, error) {
	sess, err := session.NewSession(aws.NewConfig())
	if err != nil {
		return nil, err
	}

	return WrapDynamo(dynamodb.New(sess)), nil
}

func WrapDynamo(real dynamodbiface.DynamoDBAPI) *DynamoDB {
	return &DynamoDB{real: real}
}

func (d *DynamoDB) BatchGetItemWithContext(ctx context.Context, input *dynamodb.BatchGetItemInput, opts ...request.Option) (*dynamodb.BatchGetItemOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.BatchGetItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	var itemCount int
	for table, items := range input.RequestItems {
		tables = append(tables, table)
		itemCount += len(items.Keys)
	}

	span.SetAttributes(
		dbInstanceKey(strings.Join(tables, ", ")),
		requestedItemCountKey(itemCount))

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.BatchGetItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	var total, read, write float64
	for _, capacity := range out.ConsumedCapacity {
		total += aws.Float64Value(capacity.CapacityUnits)
		read += aws.Float64Value(capacity.ReadCapacityUnits)
		write += aws.Float64Value(capacity.WriteCapacityUnits)
	}

	recordConsumedCapacity(span, &dynamodb.ConsumedCapacity{
		CapacityUnits:      &total,
		ReadCapacityUnits:  &read,
		WriteCapacityUnits: &write,
	})

	return out, nil
}

func (d *DynamoDB) BatchGetItemPagesWithContext(ctx context.Context, input *dynamodb.BatchGetItemInput, fn func(*dynamodb.BatchGetItemOutput, bool) bool, opts ...request.Option) error {
	ctx, span := tr.Start(ctx, "dynamodb.BatchGetItemPages",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	var itemCount int
	for table, items := range input.RequestItems {
		tables = append(tables, table)
		itemCount += len(items.Keys)
	}

	span.SetAttributes(
		dbInstanceKey(strings.Join(tables, ", ")),
		requestedItemCountKey(itemCount))

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	var total, read, write float64
	var pageCount int
	err := d.real.BatchGetItemPagesWithContext(ctx, input, func(out *dynamodb.BatchGetItemOutput, lastPage bool) bool {
		pageCount++
		for _, capacity := range out.ConsumedCapacity {
			total += aws.Float64Value(capacity.CapacityUnits)
			read += aws.Float64Value(capacity.ReadCapacityUnits)
			write += aws.Float64Value(capacity.WriteCapacityUnits)
		}

		return fn(out, lastPage)
	}, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return err
	}

	span.SetAttributes(pageCountKey(pageCount))
	recordConsumedCapacity(span, &dynamodb.ConsumedCapacity{
		CapacityUnits:      &total,
		ReadCapacityUnits:  &read,
		WriteCapacityUnits: &write,
	})

	return nil
}

func (d *DynamoDB) BatchWriteItemWithContext(ctx context.Context, input *dynamodb.BatchWriteItemInput, opts ...request.Option) (*dynamodb.BatchWriteItemOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.BatchWriteItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	var tables []string
	var itemCount int
	for table, items := range input.RequestItems {
		tables = append(tables, table)
		itemCount += len(items)
	}

	span.SetAttributes(
		dbInstanceKey(strings.Join(tables, ", ")),
		requestedItemCountKey(itemCount))

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.BatchWriteItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	var total, read, write float64
	for _, capacity := range out.ConsumedCapacity {
		total += aws.Float64Value(capacity.CapacityUnits)
		read += aws.Float64Value(capacity.ReadCapacityUnits)
		write += aws.Float64Value(capacity.WriteCapacityUnits)
	}

	recordConsumedCapacity(span, &dynamodb.ConsumedCapacity{
		CapacityUnits:      &total,
		ReadCapacityUnits:  &read,
		WriteCapacityUnits: &write,
	})

	return out, nil
}

func (d *DynamoDB) CreateTableWithContext(ctx context.Context, input *dynamodb.CreateTableInput, opts ...request.Option) (*dynamodb.CreateTableOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.CreateTable",
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

func (d *DynamoDB) DeleteItemWithContext(ctx context.Context, input *dynamodb.DeleteItemInput, opts ...request.Option) (*dynamodb.DeleteItemOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.DeleteItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	for k, v := range input.Key {
		span.SetAttributes(keyAttr(k, v))
	}

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.DeleteItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	recordConsumedCapacity(span, out.ConsumedCapacity)

	return out, nil
}

func (d *DynamoDB) DeleteTableWithContext(ctx context.Context, input *dynamodb.DeleteTableInput, opts ...request.Option) (*dynamodb.DeleteTableOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.DeleteTable",
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
	ctx, span := tr.Start(ctx, "dynamodb.GetItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	for k, v := range input.Key {
		span.SetAttributes(keyAttr(k, v))
	}

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.GetItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	recordConsumedCapacity(span, out.ConsumedCapacity)

	return out, nil
}

func (d *DynamoDB) PutItemWithContext(ctx context.Context, input *dynamodb.PutItemInput, opts ...request.Option) (*dynamodb.PutItemOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.PutItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	// use the fact that we know the PK and SK names
	if v, ok := input.Item[PK]; ok {
		span.SetAttributes(keyAttr(PK, v))
	}
	if v, ok := input.Item[SK]; ok {
		span.SetAttributes(keyAttr(SK, v))
	}

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.PutItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	recordConsumedCapacity(span, out.ConsumedCapacity)

	return out, nil
}

func (d *DynamoDB) QueryWithContext(ctx context.Context, input *dynamodb.QueryInput, opts ...request.Option) (*dynamodb.QueryOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.Query",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	if input.IndexName != nil {
		span.SetAttributes(indexNameKey(aws.StringValue(input.IndexName)))
	}

	span.SetAttributes(
		dbStatementKey(aws.StringValue(input.KeyConditionExpression)))

	for k, v := range input.ExpressionAttributeValues {
		span.SetAttributes(exprValAttr(k[1:], v))
	}

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.QueryWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(itemCountKey(len(out.Items)))

	for k, v := range out.LastEvaluatedKey {
		span.SetAttributes(kv.String("db.last_evaluated_key."+k, v.String()))
	}

	recordConsumedCapacity(span, out.ConsumedCapacity)

	return out, nil
}

func (d *DynamoDB) QueryPagesWithContext(ctx context.Context, input *dynamodb.QueryInput, fn func(res *dynamodb.QueryOutput, lastPage bool) bool, opts ...request.Option) error {
	ctx, span := tr.Start(ctx, "dynamodb.Query",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	if input.IndexName != nil {
		span.SetAttributes(indexNameKey(aws.StringValue(input.IndexName)))
	}

	span.SetAttributes(
		dbStatementKey(aws.StringValue(input.KeyConditionExpression)))

	for k, v := range input.ExpressionAttributeValues {
		span.SetAttributes(exprValAttr(k[1:], v))
	}

	input.SetReturnConsumedCapacity(dynamodb.ReturnConsumedCapacityIndexes)

	err := d.real.QueryPagesWithContext(ctx, input, func(out *dynamodb.QueryOutput, lastPage bool) bool {
		attrs := []kv.KeyValue{
			itemCountKey(len(out.Items)),
		}
		attrs = append(attrs, consumedCapacityAttrs(out.ConsumedCapacity)...)

		for k, v := range out.LastEvaluatedKey {
			attrs = append(attrs, kv.String("db.last_evaluated_key."+k, v.String()))
		}

		span.AddEvent(ctx, "dynamodb.QueryPage", attrs...)

		return fn(out, lastPage)
	})

	return err
}

func (d *DynamoDB) UpdateItemWithContext(ctx context.Context, input *dynamodb.UpdateItemInput, opts ...request.Option) (*dynamodb.UpdateItemOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.UpdateItem",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			dbTypeDynamo,
			dbInstanceKey(aws.StringValue(input.TableName))))
	defer span.End()

	for k, v := range input.Key {
		span.SetAttributes(keyAttr(k, v))
	}

	span.SetAttributes(dbStatementKey(aws.StringValue(input.UpdateExpression)))

	for k, v := range input.ExpressionAttributeValues {
		span.SetAttributes(exprValAttr(k[1:], v))
	}

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.UpdateItemWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	recordConsumedCapacity(span, out.ConsumedCapacity)

	return out, nil
}

func (d *DynamoDB) TransactWriteItemsWithContext(ctx context.Context, input *dynamodb.TransactWriteItemsInput, opts ...request.Option) (*dynamodb.TransactWriteItemsOutput, error) {
	ctx, span := tr.Start(ctx, "dynamodb.TransactWriteItems",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(dbTypeDynamo))
	defer span.End()

	span.SetAttributes(
		requestedItemCountKey(len(input.TransactItems)))

	input.ReturnConsumedCapacity = aws.String(dynamodb.ReturnConsumedCapacityIndexes)

	out, err := d.real.TransactWriteItemsWithContext(ctx, input, opts...)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	var total, read, write float64
	for _, capacity := range out.ConsumedCapacity {
		total += aws.Float64Value(capacity.CapacityUnits)
		read += aws.Float64Value(capacity.ReadCapacityUnits)
		write += aws.Float64Value(capacity.WriteCapacityUnits)
	}

	recordConsumedCapacity(span, &dynamodb.ConsumedCapacity{
		CapacityUnits:      &total,
		ReadCapacityUnits:  &read,
		WriteCapacityUnits: &write,
	})

	return out, nil
}

func consumedCapacityAttrs(capacity *dynamodb.ConsumedCapacity) []kv.KeyValue {
	if capacity == nil {
		return nil
	}

	return []kv.KeyValue{
		unitsConsumedKey(fmt.Sprintf("%.1f", aws.Float64Value(capacity.CapacityUnits))),
		readsConsumedKey(fmt.Sprintf("%.1f", aws.Float64Value(capacity.ReadCapacityUnits))),
		writesConsumedKey(fmt.Sprintf("%.1f", aws.Float64Value(capacity.WriteCapacityUnits))),
	}
}

func recordConsumedCapacity(span trace.Span, capacity *dynamodb.ConsumedCapacity) {
	span.SetAttributes(consumedCapacityAttrs(capacity)...)
}
