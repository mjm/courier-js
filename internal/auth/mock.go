package auth

import "context"

type mockUser struct {
	id string
}

var _ User = mockUser{}

func (u mockUser) ID() (string, error) {
	return u.id, nil
}

func (mockUser) Authenticated() bool                  { return true }
func (u mockUser) Name() string                       { return u.id }
func (u mockUser) Nickname() string                   { return u.id }
func (u mockUser) Picture() string                    { return "" }
func (u mockUser) CustomerID() string                 { return "" }
func (u mockUser) SubscriptionID() string             { return "" }
func (u mockUser) SubscriptionStatusOverride() string { return "" }
func (u mockUser) MicropubSites() []string            { return nil }

func WithMockUser(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userContextKey{}, &mockUser{id: userID})
}
