package secret

import (
	"context"
	"fmt"

	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
)

var AWSSet = wire.NewSet(
	wire.Bind(new(Keeper), new(*AWSSecretKeeper)),
	wire.Bind(new(config.Secrets), new(*AWSSecretKeeper)),
	NewAWSSecretKeeper)

type AWSSecretKeeper struct {
}

func NewAWSSecretKeeper() *AWSSecretKeeper {
	return &AWSSecretKeeper{}
}

func (sk *AWSSecretKeeper) GetSecret(ctx context.Context, key string) (string, error) {
	return "", fmt.Errorf("secret fetching has not yet been implemented")
}
