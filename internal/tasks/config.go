package tasks

import (
	"context"

	"github.com/mjm/courier-js/internal/config"
)

type Config struct {
	TaskURL         string `env:"TASKS_URL" secret:"tasks/url"`
	Queue           string `env:"GCP_TASKS_QUEUE" secret:"tasks/queue"`
	ServiceAccount  string `env:"TASKS_SERVICE_ACCOUNT"`
	CredentialsJSON string `secret:"tasks/credentials"`
}

func NewConfig(l *config.Loader) (cfg Config, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}
