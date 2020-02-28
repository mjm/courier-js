package tasks

import (
	"os"
)

type Config struct {
	TaskURL        string
	Queue          string
	ServiceAccount string
}

func NewConfig() Config {
	return Config{
		TaskURL:        os.Getenv("TASKS_URL"),
		Queue:          os.Getenv("GCP_TASKS_QUEUE"),
		ServiceAccount: os.Getenv("SERVICE_ACCOUNT_EMAIL"),
	}
}
