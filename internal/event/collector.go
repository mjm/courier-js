package event

import (
	"context"
)

type Collector struct {
	Events []interface{}
}

var _ Handler = (*Collector)(nil)

func (c *Collector) HandleEvent(ctx context.Context, evt interface{}) {
	c.Events = append(c.Events, evt)
}

func (c *Collector) Reset() {
	c.Events = nil
}
