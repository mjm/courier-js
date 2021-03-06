package write

import (
	"context"
	"fmt"
	"reflect"

	"go.opentelemetry.io/otel/api/global"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/write")

// CommandHandler is a type that can handle executing one or more types of commands.
type CommandHandler interface {
	// HandleCommand runs the given command and returns its result. The handler may
	// have to dispatch on the type of the command if it registered for multiple
	// command types.
	HandleCommand(ctx context.Context, cmd interface{}) (interface{}, error)
}

// CommandBus is a central dispatcher for commands for the application. It allows
// different parts of the application to run commands without knowing which handler
// actually runs them. In particular, this means that command handlers can dispatch
// to other command handlers without worrying about cyclic dependencies.
type CommandBus struct {
	handlers map[reflect.Type]CommandHandler
}

// NewCommandBus creates a new command bus with no handlers registered.
func NewCommandBus() *CommandBus {
	return &CommandBus{
		handlers: make(map[reflect.Type]CommandHandler),
	}
}

// Register sets up a handler h to receive commands of the types of the values given
// in vs.
func (b *CommandBus) Register(h CommandHandler, vs ...interface{}) {
	for _, v := range vs {
		t := reflect.TypeOf(v)
		b.handlers[t] = h
	}
}

// Run runs a command using the handler that registered for the command's type.
// If no handler is registered for the type of the command given, the program will
// panic.
func (b *CommandBus) Run(ctx context.Context, cmd interface{}) (interface{}, error) {
	ctx, span := tracer.Start(ctx, fmt.Sprintf("%T", cmd))
	defer span.End()

	t := reflect.TypeOf(cmd)
	h, ok := b.handlers[t]
	if !ok {
		// we could return the error, but panicing is more appropriate since this would
		// be a programming error that cannot be recovered from.
		panic(fmt.Errorf("no command handler registered for command type %v", t))
	}

	res, err := h.HandleCommand(ctx, cmd)
	if err != nil {
		span.RecordError(ctx, err)
	}
	return res, err
}
