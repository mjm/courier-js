package loader

import (
	"database/sql"
	"database/sql/driver"
	"reflect"
	"strconv"

	"github.com/graph-gophers/dataloader"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/trace"
)

// New creates a new loader that is set up correctly for tracing.
func New(label string, batchLoadFn dataloader.BatchFunc) *dataloader.Loader {
	return dataloader.NewBatchedLoader(batchLoadFn, dataloader.WithTracer(trace.DataloaderTracer{
		Label: label,
	}))
}

// Gather assembles the results for a batch load from the rows in a query result. The dataloader
// needs the results to be returned in the same order as the keys that were requested, which will
// be different than the order the DB returns them. Gather reorders the elements in the correct
// order and bundles them as dataloader.Result structures.
func Gather(keys dataloader.Keys, rows *sqlx.Rows, dest interface{}, keyFn func(interface{}) string) []*dataloader.Result {
	valueByKey := make(map[string]interface{})

	for rows.Next() {
		if err := rows.StructScan(dest); err != nil {
			// TODO expand to all rows, since we won't know what this goes with
			panic(err)
		} else {
			v := reflect.ValueOf(dest)
			copied := reflect.New(v.Elem().Type())
			copied.Elem().Set(v.Elem())
			valueByKey[keyFn(dest)] = copied.Interface()
		}
	}

	results := make([]*dataloader.Result, 0, len(keys))
	for _, key := range keys {
		results = append(results, &dataloader.Result{
			Data:  valueByKey[key.String()],
			Error: nil,
		})
	}

	return results
}

// IntArray transforms an array of keys into an integer array that PostgreSQL will accept.
func IntArray(keys dataloader.Keys) interface {
	driver.Valuer
	sql.Scanner
} {
	vals := make([]int64, 0, len(keys))
	for _, key := range keys {
		v, err := strconv.ParseInt(key.String(), 10, 64)
		if err != nil {
			panic(err)
		}
		vals = append(vals, v)
	}
	return (*pq.Int64Array)(&vals)
}

// IntKey allows passing an integer ID as a dataloader key.
type IntKey int

var _ dataloader.Key = IntKey(0)

// Raw implements dataloader.Key
func (i IntKey) Raw() interface{} {
	return i
}

// String implements dataloader.Key
func (i IntKey) String() string {
	return strconv.Itoa(int(i))
}
