package config

import (
	"context"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

type envMap map[string]string

func (env envMap) Getenv(_ context.Context, key string) (string, error) {
	return env[key], nil
}

type secretMap map[string]string

func (s secretMap) GetSecret(_ context.Context, key string) (string, error) {
	val, ok := s[key]
	if !ok {
		return "", fmt.Errorf("no secret value for key %q", key)
	}
	return val, nil
}

func TestLoadEmptyStruct(t *testing.T) {
	ctx := context.Background()
	loader := NewLoader(envMap{
		"FOO": "foo",
	}, secretMap{
		"bar": "a secret value",
	})

	var cfg struct{}
	assert.NoError(t, loader.Load(ctx, &cfg))
}

func TestLoadEnvStrings(t *testing.T) {
	ctx := context.Background()
	loader := NewLoader(envMap{
		"FOO": "foo",
		"BAR": "bar",
	}, secretMap{
		"bar": "a secret value",
	})

	var cfg struct {
		Foo string `env:"FOO"`
		Bar string `env:"BAR"`
	}
	assert.NoError(t, loader.Load(ctx, &cfg))
	assert.Equal(t, "foo", cfg.Foo)
	assert.Equal(t, "bar", cfg.Bar)
}

func TestLoadSecretStrings(t *testing.T) {
	ctx := context.Background()
	loader := NewLoader(envMap{
		"FOO": "foo",
		"BAR": "bar",
	}, secretMap{
		"foo": "a secret value",
		"bar": "another secret value",
	})

	var cfg struct {
		Foo string `secret:"foo"`
		Bar string `secret:"bar"`
	}
	assert.NoError(t, loader.Load(ctx, &cfg))
	assert.Equal(t, "a secret value", cfg.Foo)
	assert.Equal(t, "another secret value", cfg.Bar)
}

func TestLoadPrioritizeEnvVar(t *testing.T) {
	ctx := context.Background()
	loader := NewLoader(envMap{
		"FOO": "foo",
	}, secretMap{
		"foo": "a secret value",
		"bar": "another secret value",
	})

	var cfg struct {
		Foo string `env:"FOO" secret:"foo"`
		Bar string `env:"BAR" secret:"bar"`
	}
	assert.NoError(t, loader.Load(ctx, &cfg))
	assert.Equal(t, "foo", cfg.Foo)
	assert.Equal(t, "another secret value", cfg.Bar)
}

type embedded struct {
	Foo string `secret:"foo"`
	Bar string `secret:"bar"`
}

func TestLoadEmbeddedStruct(t *testing.T) {
	ctx := context.Background()
	loader := NewLoader(envMap{
		"FOO": "foo",
	}, secretMap{
		"foo": "a secret value",
		"bar": "another secret value",
	})

	var cfg struct {
		embedded
		Foo string `env:"FOO"`
	}
	assert.NoError(t, loader.Load(ctx, &cfg))
	assert.Equal(t, "foo", cfg.Foo)
	assert.Equal(t, "a secret value", cfg.embedded.Foo)
	assert.Equal(t, "another secret value", cfg.Bar)
}
