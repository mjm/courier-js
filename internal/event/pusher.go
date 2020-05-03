package event

import (
	"context"
	"os"

	"github.com/google/wire"
	pushnotifications "github.com/pusher/push-notifications-go"
	"github.com/pusher/pusher-http-go"

	"github.com/mjm/courier-js/internal/config"
)

var PusherSet = wire.NewSet(NewPusherConfig, NewPusherClient, NewBeamsClient)

type PusherConfig struct {
	ChannelsURL     string `secret:"push/pusher/url"`
	BeamsInstanceID string `secret:"push/beams/instance-id"`
	BeamsSecretKey  string `secret:"push/beams/secret-key"`
}

func NewPusherConfig(l *config.Loader) (cfg PusherConfig, err error) {
	err = l.Load(context.Background(), &cfg, config.WithSecretKeyResolver(pusherSecretResolver))
	return
}

func pusherSecretResolver(key string) string {
	if key == "push/pusher/url" && os.Getenv("APP_ENV") == "dev" {
		return "push/pusher/url-dev"
	}
	return key
}

func NewPusherClient(cfg PusherConfig) (*pusher.Client, error) {
	return pusher.ClientFromURL(cfg.ChannelsURL)
}

func NewBeamsClient(cfg PusherConfig) (pushnotifications.PushNotifications, error) {
	return pushnotifications.New(cfg.BeamsInstanceID, cfg.BeamsSecretKey)
}
