package event

import (
	"context"
)

// Sink is a type that can receive events that should be distributed to handlers.
type Sink interface {
	Fire(ctx context.Context, evt interface{})
}
