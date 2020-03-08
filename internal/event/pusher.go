package event

import (
	"context"
	"os"

	pushnotifications "github.com/pusher/push-notifications-go"
	"github.com/pusher/pusher-http-go"

	"github.com/mjm/courier-js/internal/secret"
)

func NewPusherClient(sk secret.Keeper) (*pusher.Client, error) {
	key := "pusher-url"
	if os.Getenv("APP_ENV") == "dev" {
		key = "pusher-url-dev"
	}

	url, err := sk.GetSecret(context.Background(), key)
	if err != nil {
		return nil, err
	}

	return pusher.ClientFromURL(url)
}

func NewBeamsClient(sk secret.Keeper) (pushnotifications.PushNotifications, error) {
	key, err := sk.GetSecret(context.Background(), "beams-secret-key")
	if err != nil {
		return nil, err
	}

	return pushnotifications.New(os.Getenv("BEAMS_INSTANCE_ID"), key)
}
