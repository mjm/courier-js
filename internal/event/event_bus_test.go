package event

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

type fakeEvent struct {
	foo string
}

type fakeEvent2 struct {
	bar int
}

type testHandler struct {
	f func(evt interface{})
}

func fnHandler(f func(evt interface{})) *testHandler {
	return &testHandler{f: f}
}

func (h testHandler) HandleEvent(ctx context.Context, evt interface{}) {
	h.f(evt)
}

func TestEventBusSingleHandler(t *testing.T) {
	bus := NewBus()

	var gotEvent interface{}
	bus.Notify(fnHandler(func(evt interface{}) {
		assert.Nil(t, gotEvent)
		gotEvent = evt
	}), fakeEvent{})

	bus.Fire(context.Background(), fakeEvent{foo: "bar"})
	assert.NotNil(t, gotEvent)
	assert.Equal(t, "bar", gotEvent.(fakeEvent).foo)
}

func TestEventNoHandlers(t *testing.T) {
	bus := NewBus()
	bus.Fire(context.Background(), fakeEvent{foo: "bar"})
}

func TestMultipleEventHandlersSameType(t *testing.T) {
	bus := NewBus()

	var event1, event2 interface{}
	bus.Notify(fnHandler(func(evt interface{}) {
		assert.Nil(t, event1)
		event1 = evt
	}), fakeEvent{})
	bus.Notify(fnHandler(func(evt interface{}) {
		assert.Nil(t, event2)
		event2 = evt
	}), fakeEvent{})

	bus.Fire(context.Background(), fakeEvent{foo: "bar"})
	assert.NotNil(t, event1)
	assert.Equal(t, "bar", event1.(fakeEvent).foo)
	assert.NotNil(t, event2)
	assert.Equal(t, "bar", event2.(fakeEvent).foo)
}

func TestEventHandlersDifferentTypes(t *testing.T) {
	bus := NewBus()

	var event1, event2 interface{}
	bus.Notify(fnHandler(func(evt interface{}) {
		assert.Nil(t, event1)
		event1 = evt
	}), fakeEvent{})
	bus.Notify(fnHandler(func(evt interface{}) {
		assert.Nil(t, event2)
		event2 = evt
	}), fakeEvent2{})

	bus.Fire(context.Background(), fakeEvent{foo: "bar"})
	assert.NotNil(t, event1)
	assert.Equal(t, "bar", event1.(fakeEvent).foo)
	assert.Nil(t, event2)

	event1 = nil
	bus.Fire(context.Background(), fakeEvent2{bar: 3})
	assert.Nil(t, event1)
	assert.NotNil(t, event2)
	assert.Equal(t, 3, event2.(fakeEvent2).bar)
}
