package pager

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
