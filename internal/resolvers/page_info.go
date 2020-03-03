package resolvers

import "github.com/mjm/courier-js/internal/pager"

type PageInfo struct {
	pager.PageInfo
}

func (pi PageInfo) HasNextPage() bool {
	return pi.PageInfo.HasNextPage
}

func (pi PageInfo) HasPreviousPage() bool {
	return pi.PageInfo.HasPreviousPage
}

func (pi PageInfo) StartCursor() *pager.Cursor {
	return pi.PageInfo.StartCursor
}

func (pi PageInfo) EndCursor() *pager.Cursor {
	return pi.PageInfo.EndCursor
}
