package courier

import (
	"os"

	"github.com/mjm/courier-js/internal/secret"
)

var secretConfig secret.GCPConfig

func init() {
	secretConfig.ProjectID = os.Getenv("GCP_PROJECT")
	secretConfig.CredentialsFile = os.Getenv("GCP_CREDENTIALS_FILE")
}
