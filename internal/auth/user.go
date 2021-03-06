package auth

import (
	"sync"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

// var ErrUnauthorized = errors.New("no user credentials were provided")
var ErrUnauthorized = status.Error(codes.Unauthenticated, "no user credentials were provided")

type User interface {
	ID() (string, error)
	Authenticated() bool
	Name() string
	Nickname() string
	Picture() string
	CustomerID() string
	SubscriptionID() string
	SubscriptionStatusOverride() string
	MicropubSites() []string
}

type AnonymousUser struct{}

func (AnonymousUser) ID() (string, error) {
	return "", ErrUnauthorized
}
func (AnonymousUser) Authenticated() bool                { return false }
func (AnonymousUser) Name() string                       { return "" }
func (AnonymousUser) Nickname() string                   { return "" }
func (AnonymousUser) Picture() string                    { return "" }
func (AnonymousUser) CustomerID() string                 { return "" }
func (AnonymousUser) SubscriptionID() string             { return "" }
func (AnonymousUser) SubscriptionStatusOverride() string { return "" }
func (AnonymousUser) MicropubSites() []string            { return nil }

type TokenUser struct {
	token         *jwt.Token
	authenticator *Authenticator

	userInfo *management.User
	lock     sync.Mutex
}

func (u *TokenUser) ID() (string, error) {
	return u.claims().Subject, nil
}

func (*TokenUser) Authenticated() bool {
	return true
}

func (u *TokenUser) Name() string {
	info, err := u.getUserInfo()
	if err != nil {
		return ""
	}
	return info.GetName()
}

func (u *TokenUser) Nickname() string {
	info, err := u.getUserInfo()
	if err != nil {
		return ""
	}

	// TODO this is wrong but I can't get the screen_name from this API client
	return info.GetNickname()
}

func (u *TokenUser) Picture() string {
	info, err := u.getUserInfo()
	if err != nil {
		return ""
	}

	return info.GetPicture()
}

func (u *TokenUser) CustomerID() string {
	return u.claims().StripeCustomerID
}

func (u *TokenUser) SubscriptionID() string {
	return u.claims().StripeSubscriptionID
}

func (u *TokenUser) SubscriptionStatusOverride() string {
	return u.claims().SubscriptionStatus
}

func (u *TokenUser) MicropubSites() []string {
	return u.claims().MicropubSites
}

func (u *TokenUser) getUserInfo() (*management.User, error) {
	u.lock.Lock()
	defer u.lock.Unlock()

	if u.userInfo != nil {
		return u.userInfo, nil
	}

	info, err := u.authClient().User.Read(u.claims().Subject)
	if err != nil {
		return nil, err
	}

	u.userInfo = info
	return info, nil
}

func (u *TokenUser) claims() *Claims {
	return u.token.Claims.(*Claims)
}

func (u *TokenUser) authClient() *management.Management {
	return u.authenticator.management
}
