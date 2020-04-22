package db

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"go.opentelemetry.io/otel/api/core"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
)

var tr = global.Tracer("courier.blog/internal/db")

var (
	dbTypeDynamo   = key.String("db.type", "dynamodb")
	dbInstanceKey  = key.New("db.instance").String
	dbStatementKey = key.New("db.statement").String
	indexNameKey   = key.New("db.index").String

	pageCountKey          = key.New("db.page_count").Int
	requestedItemCountKey = key.New("db.request_item_count").Int
	itemCountKey          = key.New("db.item_count").Int

	unitsConsumedKey  = key.New("db.consumed.total").String
	readsConsumedKey  = key.New("db.consumed.reads").String
	writesConsumedKey = key.New("db.consumed.writes").String
)

func keyAttr(k string, v *dynamodb.AttributeValue) core.KeyValue {
	return key.String("db.key."+k, v.String())
}

func exprValAttr(k string, v *dynamodb.AttributeValue) core.KeyValue {
	return key.String("db.value."+k, v.String())
}
