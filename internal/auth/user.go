package auth

import "gopkg.in/dgrijalva/jwt-go.v3"

type User interface {
	Authenticated() bool
}

type AnonymousUser struct {
}

func (AnonymousUser) Authenticated() bool {
	return false
}

type TokenUser struct {
	token *jwt.Token
}

func (*TokenUser) Authenticated() bool {
	return true
}
