package config

import (
	"context"
	"errors"
	"reflect"

	"github.com/google/wire"
)

var DefaultSet = wire.NewSet(NewLoader, wire.Bind(new(Env), new(*DefaultEnv)), wire.Struct(new(DefaultEnv)))

var (
	ErrNotPointer = errors.New("must pass a pointer to Load()")
)

type loadSettings struct {
	secretKeyResolver func(string) string
}

type LoadOption interface {
	Apply(*loadSettings)
}

type withSecretKeyResolver func(string) string

func (o withSecretKeyResolver) Apply(s *loadSettings) {
	s.secretKeyResolver = o
}

func WithSecretKeyResolver(fn func(string) string) LoadOption {
	return withSecretKeyResolver(fn)
}

type Loader struct {
	Env     Env
	Secrets Secrets
}

func NewLoader(env Env, secrets Secrets) *Loader {
	return &Loader{
		Env:     env,
		Secrets: secrets,
	}
}

func (l *Loader) Load(ctx context.Context, dst interface{}, opts ...LoadOption) error {
	v := reflect.ValueOf(dst)

	if v.Kind() != reflect.Ptr {
		return ErrNotPointer
	}

	v = v.Elem()

	settings := &loadSettings{
		secretKeyResolver: func(key string) string { return key },
	}
	for _, opt := range opts {
		opt.Apply(settings)
	}

	return l.loadStructValue(ctx, settings, v)
}

func (l *Loader) loadStructValue(ctx context.Context, settings *loadSettings, v reflect.Value) error {
	t := v.Type()

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)

		switch field.Type.Kind() {
		case reflect.Struct:
			if err := l.loadStructValue(ctx, settings, v.Field(i)); err != nil {
				return err
			}
		case reflect.String:
			envKey := field.Tag.Get("env")
			if envKey != "" {
				val, err := l.Env.Getenv(ctx, envKey)
				if err != nil {
					return err
				}

				if val != "" {
					v.Field(i).SetString(val)
					continue
				}
			}

			secretKey := field.Tag.Get("secret")
			if secretKey != "" {
				secretKey = settings.secretKeyResolver(secretKey)
				val, err := l.Secrets.GetSecret(ctx, secretKey)
				if err != nil {
					return err
				}

				if val != "" {
					v.Field(i).SetString(val)
					continue
				}
			}
		}
	}

	return nil
}
