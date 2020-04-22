package loader

import (
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
)

// New creates a new loader that is set up correctly for tracing.
func New(label string, batchLoadFn dataloader.BatchFunc) *dataloader.Loader {
	return dataloader.NewBatchedLoader(
		batchLoadFn,
		dataloader.WithTracer(&DataloaderTracer{
			Label: label,
		}),
		dataloader.WithCache(&contextCache{prefix: uuid.New().String()}),
	)
}

type ID interface {
	PrimaryKey() map[string]*dynamodb.AttributeValue
	PrimaryKeyValues() (string, string)
}

type idKey struct {
	ID
}

func (key idKey) String() string {
	pk, sk := key.PrimaryKeyValues()
	return pk + "###" + sk
}

func (key idKey) Raw() interface{} {
	return key.ID
}

func IDKey(id ID) dataloader.Key {
	return idKey{ID: id}
}
