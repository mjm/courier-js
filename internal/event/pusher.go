package event

import (
	"context"
	"os"

	"github.com/pusher/pusher-http-go"

	"github.com/mjm/courier-js/internal/secret"
)

func NewPusherClient(sk secret.Keeper) (*pusher.Client, error) {
	key := "pusher-url"
	if os.Getenv("APP_ENV") == "dev" {
		key = "pusher-url-dev"
	}

	url, err := sk.GetString(context.Background(), key)
	if err != nil {
		return nil, err
	}

	return pusher.ClientFromURL(url)
}
