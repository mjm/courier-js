package trace

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

// Config gives fields to configure tracing.
type Config struct {
	Dataset  string `env:"HONEY_DATASET" secret:"honeycomb/dataset"`
	WriteKey string `secret:"honeycomb/write-key"`
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}
