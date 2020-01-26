package resolvers

import (
	"github.com/mjm/courier-js/internal/auth"
)

type User struct {
	user auth.User
}

func (u *User) Name() string {
	return u.user.Name()
}

func (u *User) Nickname() string {
	return u.user.Nickname()
}

func (u *User) Picture() string {
	return u.user.Picture()
}
