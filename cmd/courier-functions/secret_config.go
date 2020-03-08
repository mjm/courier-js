package main

import (
	"github.com/mjm/courier-js/internal/secret"
)

var secretConfig secret.GCPConfig

func init() {
	var err error
	secretConfig, err = secret.GCPConfigFromEnv()
	if err != nil {
		panic(err)
	}
}
