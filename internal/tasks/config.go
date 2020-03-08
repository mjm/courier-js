package tasks

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

type Config struct {
	TaskURL        string `env:"TASKS_URL"`
	Queue          string `env:"GCP_TASKS_QUEUE"`
	ServiceAccount string `env:"TASKS_SERVICE_ACCOUNT"`
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}
