package config

import (
	"context"
)

type Secrets interface {
	GetSecret(ctx context.Context, key string) (string, error)
}
