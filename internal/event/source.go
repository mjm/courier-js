package event

// Source is a type that can dispatch events to handlers when they are received.
type Source interface {
	Notify(h Handler)
}
