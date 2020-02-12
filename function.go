package courier

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/mjm/courier-js/internal/graphql"
	"github.com/mjm/courier-js/internal/secret"
)

var handler *graphql.Handler

func init() {
	s, err := ioutil.ReadFile("schema.graphql")
	if err != nil {
		panic(err)
	}

	handler, err = graphql.InitializeHandler(string(s), secret.GCPConfig{
		ProjectID:       os.Getenv("GCP_PROJECT"),
		CredentialsFile: os.Getenv("GCP_CREDENTIALS_FILE"),
	})
	if err != nil {
		panic(err)
	}
}

// GraphQL handles GraphQL requests.
func GraphQL(w http.ResponseWriter, r *http.Request) {
	handler.ServeHTTP(w, r)
}
