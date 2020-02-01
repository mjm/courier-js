package courier

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/graphql"
	"github.com/mjm/courier-js/internal/trace"
)

var handler *graphql.Handler

func init() {
	trace.Init(trace.Config{
		Dataset:  os.Getenv("HONEY_DATASET"),
		WriteKey: os.Getenv("HONEY_WRITE_KEY"),
	})

	s, err := ioutil.ReadFile("schema2.graphql")
	if err != nil {
		panic(err)
	}

	handler, err = graphql.InitializeHandler(string(s), auth.Config{
		AuthDomain:   os.Getenv("AUTH_DOMAIN"),
		ClientID:     os.Getenv("BACKEND_CLIENT_ID"),
		ClientSecret: os.Getenv("BACKEND_CLIENT_SECRET"),
	}, db.Config{
		URL: os.Getenv("DATABASE_URL"),
	}, billing.Config{
		SecretKey: os.Getenv("STRIPE_SECRET_KEY"),
	})
	if err != nil {
		panic(err)
	}
}

// GraphQL handles GraphQL requests.
func GraphQL(w http.ResponseWriter, r *http.Request) {
	handler.ServeHTTP(w, r)
}
