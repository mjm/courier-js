package pager

import (
	"context"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/db"
)

// Pager defines how to query for a paged results set.
type Pager interface {
	// EdgesQuery returns the SQL query that will fetch a page of results. Filters, sorting, and
	// limits will be appended to the string to form the final query.
	EdgesQuery() string
	// TotalQuery returns the SQL query that will fetch the total number of rows in the unpaged
	// result set.
	TotalQuery() string
	// Params returns any pager-specific named parameters that are used in `EdgesQuery` or
	// `TotalQuery`.
	Params() map[string]interface{}
	// OrderBy specifies the column name to use to sort results, as well as whether the results
	// should be sorted ascending by default. The order column is also used as the basis for
	// cursors.
	OrderBy() (string, bool)
	// FromCursor converts a cursor string to a value suitable in a database query.
	FromCursor(value Cursor) interface{}
	// ScanEdge reads a single row from the query results and constructs an Edge from it.
	ScanEdge(rows *sqlx.Rows) (Edge, error)
}

// Connection is the result of fetching a page of results.
type Connection struct {
	Edges      []Edge
	TotalCount int32
	PageInfo   PageInfo
}

// Edge is a single entry of a paged result.
type Edge interface {
	// Cursor is the value that can be used to fetch more results from this edge's position.
	Cursor() Cursor
}

// PageInfo includes information about whether and how to fetch more results after this
// a particular page of results.
type PageInfo struct {
	HasNextPage     bool
	HasPreviousPage bool
	StartCursor     *Cursor
	EndCursor       *Cursor
}

// Options determine which subset of the result set will be fetched when paging.
type Options struct {
	First  *int32
	After  *Cursor
	Last   *int32
	Before *Cursor
}

// First returns pager options for paging from the beginning of the results.
func First(n int32, after *Cursor) Options {
	return Options{First: &n, After: after}
}

// Last returns pager options for paging from the end of the results.
func Last(n int32, before *Cursor) Options {
	return Options{Last: &n, Before: before}
}

// Paged loads a single page of results from a pager.
func Paged(ctx context.Context, db db.DB, p Pager, opts Options) (*Connection, error) {
	params := make(map[string]interface{})
	for k, v := range p.Params() {
		params[k] = v
	}

	var pageInfo PageInfo

	query := fixQuery(p.EdgesQuery())
	orderBy, ascending := p.OrderBy()
	if opts.isReversed() {
		ascending = !ascending
	}

	cmp := ">"
	dir := "ASC"
	if !ascending {
		cmp = "<"
		dir = "DESC"
	}

	var q strings.Builder
	q.WriteString(query)
	cursor := opts.cursor()
	if cursor != nil {
		fmt.Fprintf(&q, "\n%s %s %s :cursor", joiner(query), orderBy, cmp)
		params["cursor"] = p.FromCursor(*cursor)
	}
	fmt.Fprintf(&q, "\nORDER BY %s %s", orderBy, dir)
	fmt.Fprintf(&q, "\nLIMIT %d", opts.limit()+1)

	wg, subCtx := errgroup.WithContext(ctx)

	var edges []Edge
	wg.Go(func() error {
		rows, err := db.NamedQueryContext(subCtx, q.String(), params)
		if err != nil {
			return err
		}

		for rows.Next() {
			edge, err := p.ScanEdge(rows)
			if err != nil {
				return err
			}

			edges = append(edges, edge)
		}

		if len(edges) > int(opts.limit()) {
			if opts.isReversed() {
				pageInfo.HasPreviousPage = true
			} else {
				pageInfo.HasNextPage = true
			}
			edges = edges[:opts.limit()]
		}

		if len(edges) > 0 {
			start := edges[0].Cursor()
			pageInfo.StartCursor = &start
			end := edges[len(edges)-1].Cursor()
			pageInfo.EndCursor = &end
		}

		return nil
	})

	var total int32
	wg.Go(func() error {
		res, err := db.NamedQueryContext(subCtx, p.TotalQuery(), params)
		if err != nil {
			return err
		}
		if !res.Next() {
			return fmt.Errorf("total count query returned no results")
		}
		if err := res.Scan(&total); err != nil {
			return err
		}

		return nil
	})

	if err := wg.Wait(); err != nil {
		return nil, err
	}

	return &Connection{
		Edges:      edges,
		TotalCount: total,
		PageInfo:   pageInfo,
	}, nil
}

func joiner(query string) string {
	if strings.Contains(strings.ToUpper(query), "WHERE") {
		return "AND"
	}
	return "WHERE"
}

func (o Options) limit() int32 {
	if o.isReversed() {
		return *o.Last
	} else if o.First != nil {
		return *o.First
	}

	return 100
}

func (o Options) cursor() *Cursor {
	if o.isReversed() {
		return o.Before
	}
	return o.After
}

func (o Options) isReversed() bool {
	return o.Last != nil
}

func reverse(edges []Edge) {
	for left, right := 0, len(edges)-1; left < right; left, right = left+1, right-1 {
		edges[left], edges[right] = edges[right], edges[left]
	}
}

func fixQuery(q string) string {
	// our query constants are semicolon-terminated, but we need to append things to the edges
	// query.
	return strings.TrimSuffix(q, ";")
}
