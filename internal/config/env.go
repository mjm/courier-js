package config

import (
	"context"
	"os"
)

type Env interface {
	Getenv(ctx context.Context, key string) (string, error)
}

type DefaultEnv struct{}

func (DefaultEnv) Getenv(_ context.Context, key string) (string, error) {
	return os.Getenv(key), nil
}
