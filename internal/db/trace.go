package db

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
)

var tr = global.Tracer("courier.blog/internal/db")

var (
	dbTypeDynamo   = kv.String("db.type", "dynamodb")
	dbInstanceKey  = kv.Key("db.instance").String
	dbStatementKey = kv.Key("db.statement").String
	indexNameKey   = kv.Key("db.index").String

	pageCountKey          = kv.Key("db.page_count").Int
	requestedItemCountKey = kv.Key("db.request_item_count").Int
	itemCountKey          = kv.Key("db.item_count").Int

	unitsConsumedKey  = kv.Key("db.consumed.total").String
	readsConsumedKey  = kv.Key("db.consumed.reads").String
	writesConsumedKey = kv.Key("db.consumed.writes").String
)

func keyAttr(k string, v *dynamodb.AttributeValue) kv.KeyValue {
	return kv.String("db.key."+k, v.String())
}

func exprValAttr(k string, v *dynamodb.AttributeValue) kv.KeyValue {
	return kv.String("db.value."+k, v.String())
}
