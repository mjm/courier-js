package secret

import (
	"context"
	"fmt"

	secretmanager "cloud.google.com/go/secretmanager/apiv1beta1"
	"github.com/google/wire"
	"google.golang.org/api/option"
	secretmanagerpb "google.golang.org/genproto/googleapis/cloud/secretmanager/v1beta1"

	"github.com/mjm/courier-js/internal/config"
)

type GCPConfig struct {
	ProjectID       string `env:"GOOGLE_PROJECT"`
	CredentialsFile string `env:"GCP_CREDENTIALS_FILE"`
}

func GCPConfigFromEnv() (cfg GCPConfig, err error) {
	l := config.NewLoader(config.DefaultEnv{}, nil)
	err = l.Load(context.Background(), &cfg)
	return
}

var GCPSet = wire.NewSet(
	wire.Bind(new(Keeper), new(*GCPSecretKeeper)),
	wire.Bind(new(config.Secrets), new(*GCPSecretKeeper)),
	NewGCPSecretKeeper,
	NewSecretManager)

type GCPSecretKeeper struct {
	project string
	sm      *secretmanager.Client
}

func NewGCPSecretKeeper(opts GCPConfig, sm *secretmanager.Client) *GCPSecretKeeper {
	return &GCPSecretKeeper{
		project: opts.ProjectID,
		sm:      sm,
	}
}

func NewSecretManager(opts GCPConfig) (*secretmanager.Client, error) {
	var o []option.ClientOption
	if opts.CredentialsFile != "" {
		o = append(o, option.WithCredentialsFile(opts.CredentialsFile))
	}
	return secretmanager.NewClient(context.Background(), o...)
}

func (sk *GCPSecretKeeper) GetSecret(ctx context.Context, key string) (string, error) {
	name := fmt.Sprintf("projects/%s/secrets/%s/versions/latest", sk.project, key)
	req := &secretmanagerpb.AccessSecretVersionRequest{
		Name: name,
	}

	result, err := sk.sm.AccessSecretVersion(ctx, req)
	if err != nil {
		return "", fmt.Errorf("could not read secret %q: %w", name, err)
	}

	return string(result.GetPayload().GetData()), nil
}
