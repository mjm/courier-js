package secret

import (
	"context"
)

type Keeper interface {
	GetString(context.Context, string) (string, error)
}
