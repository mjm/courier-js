package auth

import (
	"errors"
	"sync"

	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

var ErrUnauthorized = errors.New("no user credentials were provided")

type User interface {
	MustID() (string, error)
	Authenticated() bool
	Name() string
	Nickname() string
	Picture() string
	CustomerID() string
}

type AnonymousUser struct{}

func (AnonymousUser) MustID() (string, error) {
	return "", ErrUnauthorized
}
func (AnonymousUser) Authenticated() bool { return false }
func (AnonymousUser) Name() string        { return "" }
func (AnonymousUser) Nickname() string    { return "" }
func (AnonymousUser) Picture() string     { return "" }
func (AnonymousUser) CustomerID() string  { return "" }

type TokenUser struct {
	token         *jwt.Token
	authenticator *Authenticator

	userInfo *management.User
	lock     sync.Mutex
}

func (u *TokenUser) MustID() (string, error) {
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
