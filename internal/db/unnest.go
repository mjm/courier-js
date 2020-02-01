package db

import (
	"database/sql/driver"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

type Unnester struct {
	cols []unnestColumn
}

type unnestColumn struct {
	colType string
	values  []driver.Value
}

func NewUnnester(colTypes ...string) *Unnester {
	var cols []unnestColumn
	for _, t := range colTypes {
		cols = append(cols, unnestColumn{
			colType: t,
		})
	}
	return &Unnester{cols: cols}
}

func (u *Unnester) AppendRow(vs ...driver.Value) {
	if len(vs) != len(u.cols) {
		panic(fmt.Errorf("trying to append row with %d values to an unnester with %d columns", len(vs), len(u.cols)))
	}

	for i, v := range vs {
		u.cols[i].values = append(u.cols[i].values, v)
	}
}

func (u *Unnester) Unnest() string {
	var b strings.Builder
	b.WriteString("unnest(")

	for i, col := range u.cols {
		if i > 0 {
			b.WriteString(", ")
		}
		fmt.Fprintf(&b, "$%d::%s[]", i+1, col.colType)
	}

	b.WriteString(")")
	return b.String()
}

func (u *Unnester) Values() []interface{} {
	var vs []interface{}

	for _, col := range u.cols {
		vs = append(vs, pq.Array(col.values))
	}

	return vs
}
