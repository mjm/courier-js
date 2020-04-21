package resolvers

import (
	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/user"
)

type EventConnection struct {
	q    Queries
	conn *pager.Connection
}

func (c *EventConnection) Edges() []*EventEdge {
	var edges []*EventEdge
	for _, edge := range c.conn.Edges {
		edges = append(edges, &EventEdge{
			q:         c.q,
			EventEdge: edge.(*user.EventEdge),
		})
	}
	return edges
}

func (c *EventConnection) Nodes() []*Event {
	var nodes []*Event
	for _, edge := range c.conn.Edges {
		node := edge.(*user.EventEdge).Event
		nodes = append(nodes, NewEvent(c.q, &node))
	}
	return nodes
}

func (c *EventConnection) PageInfo() PageInfo {
	return PageInfo{c.conn.PageInfo}
}

func (c *EventConnection) TotalCount() int32 {
	return c.conn.TotalCount
}

type EventEdge struct {
	*user.EventEdge
	q Queries
}

func (e *EventEdge) Node() *Event {
	return NewEvent(e.q, &e.Event)
}
