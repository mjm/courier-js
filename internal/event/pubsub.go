package event

import (
	"context"

	"cloud.google.com/go/pubsub"
	"google.golang.org/api/option"

	"github.com/mjm/courier-js/internal/secret"
)

func NewPubSubClient(cfg secret.GCPConfig) (*pubsub.Client, error) {
	ctx := context.Background()
	var o []option.ClientOption
	if cfg.CredentialsFile != "" {
		o = append(o, option.WithCredentialsFile(cfg.CredentialsFile))
	}
	client, err := pubsub.NewClient(ctx, cfg.ProjectID, o...)
	if err != nil {
		return nil, err
	}

	return client, nil
}
