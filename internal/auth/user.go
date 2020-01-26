package auth

import (
	"sync"

	"gopkg.in/auth0.v3/management"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

type User interface {
	Authenticated() bool
	Name() string
	Nickname() string
	Picture() string
}

type AnonymousUser struct{}

func (AnonymousUser) Authenticated() bool { return false }
func (AnonymousUser) Name() string        { return "" }
func (AnonymousUser) Nickname() string    { return "" }
func (AnonymousUser) Picture() string     { return "" }

type TokenUser struct {
	token         *jwt.Token
	authenticator *Authenticator

	userInfo *management.User
	lock     sync.Mutex
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
