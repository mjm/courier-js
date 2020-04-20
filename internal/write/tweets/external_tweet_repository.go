package tweets

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/config"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/trace/keys"
	"github.com/mjm/courier-js/pkg/tracehttp"
)

var (
	ErrNoTwitterIdentity = errors.New("no twitter identity found")
	ErrNoContentType     = errors.New("no content type")
)

type TwitterConfig struct {
	ConsumerKey    string `secret:"twitter-consumer-key"`
	ConsumerSecret string `secret:"twitter-consumer-secret"`
}

func NewTwitterConfig(l *config.Loader) (cfg TwitterConfig, err error) {
	err = l.Load(context.Background(), &cfg)
	return
}

func (cfg TwitterConfig) OAuthConfig() *oauth1.Config {
	return oauth1.NewConfig(cfg.ConsumerKey, cfg.ConsumerSecret)
}

type ExternalTweetRepository struct {
	authDomain string
	config     *oauth1.Config
	client     *http.Client
	authClient *http.Client
}

func NewExternalTweetRepository(authConfig auth.Config, twitterConfig TwitterConfig) *ExternalTweetRepository {
	baseURL := "https://" + authConfig.AuthDomain
	conf := &clientcredentials.Config{
		ClientID:     authConfig.ClientID,
		ClientSecret: authConfig.ClientSecret,
		TokenURL:     baseURL + "/oauth/token",
		EndpointParams: url.Values{
			"audience": {baseURL + "/api/v2/"},
		},
		AuthStyle: oauth2.AuthStyleInParams,
	}
	client := conf.Client(context.Background())
	client.Transport = tracehttp.WrapTransport(client.Transport)
	return &ExternalTweetRepository{
		authDomain: authConfig.AuthDomain,
		config:     twitterConfig.OAuthConfig(),
		client: &http.Client{
			Transport: tracehttp.DefaultTransport,
		},
		authClient: client,
	}
}

func (r *ExternalTweetRepository) Create(ctx context.Context, userID string, tweet *model.Tweet, inReplyTo int64) (*twitter.Tweet, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.Create",
		trace.WithAttributes(
			keys.UserID(userID),
			key.Int64("tweet.in_reply_to", inReplyTo)))
	defer span.End()

	client, err := r.newClient(ctx, userID)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	mediaIDs, err := r.uploadMediaURLs(ctx, client, tweet.MediaURLs)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(key.Int("tweet.media_id_count", len(mediaIDs)))

	postedTweet, res, err := client.Statuses.Update(tweet.Body, &twitter.StatusUpdateParams{
		MediaIds:          mediaIDs,
		InReplyToStatusID: inReplyTo,
	})
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(postedTweetIDKey(postedTweet.ID), responseStatusKey(res.StatusCode))
	return postedTweet, nil
}

func (r *ExternalTweetRepository) Retweet(ctx context.Context, userID string, retweetID int64) (*twitter.Tweet, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.Retweet",
		trace.WithAttributes(
			keys.UserID(userID),
			key.Int64("tweet.retweet_id", retweetID)))
	defer span.End()

	client, err := r.newClient(ctx, userID)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	postedTweet, res, err := client.Statuses.Retweet(retweetID, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(postedTweetIDKey(postedTweet.ID), responseStatusKey(res.StatusCode))
	return postedTweet, nil
}

type twitterClient struct {
	*twitter.Client
	httpClient *http.Client
}

func (r *ExternalTweetRepository) newClient(ctx context.Context, userID string) (*twitterClient, error) {
	token, sec, err := r.getTwitterCredentials(ctx, userID)
	if err != nil {
		return nil, err
	}

	httpClient := r.config.Client(ctx, oauth1.NewToken(token, sec))
	return &twitterClient{
		Client:     twitter.NewClient(httpClient),
		httpClient: httpClient,
	}, nil
}

func (r *ExternalTweetRepository) getTwitterCredentials(ctx context.Context, userID string) (string, string, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.getTwitterCredentials",
		trace.WithAttributes(keys.UserID(userID), keys.AuthDomain(r.authDomain)))
	defer span.End()

	u := fmt.Sprintf("https://%s/api/v2/users/%s", r.authDomain, userID)
	req, err := http.NewRequestWithContext(ctx, "GET", u, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return "", "", err
	}

	res, err := r.authClient.Do(req)
	if err != nil {
		span.RecordError(ctx, err)
		return "", "", err
	}

	if res.StatusCode < http.StatusOK || res.StatusCode >= http.StatusBadRequest {
		err = fmt.Errorf("bad status code %d", res.StatusCode)
		span.RecordError(ctx, err)
		return "", "", err
	}

	var user struct {
		Identities []*struct {
			Provider          *string `json:"provider,omitempty"`
			AccessToken       *string `json:"access_token,omitempty"`
			AccessTokenSecret *string `json:"access_token_secret,omitempty"`
		} `json:"identities,omitempty"`
	}
	if err := json.NewDecoder(res.Body).Decode(&user); err != nil {
		span.RecordError(ctx, err)
		return "", "", err
	}
	if err := res.Body.Close(); err != nil {
		span.RecordError(ctx, err)
		return "", "", err
	}

	span.SetAttributes(key.Int("auth.identity_count", len(user.Identities)))

	for _, ident := range user.Identities {
		if ident.Provider != nil && *ident.Provider == "twitter" {
			var accessToken, accessTokenSecret string
			if ident.AccessToken != nil {
				accessToken = *ident.AccessToken
			}
			if ident.AccessTokenSecret != nil {
				accessTokenSecret = *ident.AccessTokenSecret
			}
			return accessToken, accessTokenSecret, nil
		}
	}

	span.RecordError(ctx, ErrNoTwitterIdentity)
	return "", "", ErrNoTwitterIdentity
}

func (r *ExternalTweetRepository) uploadMediaURLs(ctx context.Context, client *twitterClient, urls []string) ([]int64, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.uploadMediaURLs",
		trace.WithAttributes(key.Int("tweet.media_url_count", len(urls))))
	defer span.End()

	group, subCtx := errgroup.WithContext(ctx)

	ids := make([]int64, len(urls))

	for i, url := range urls {
		group.Go(func() error {
			mediaID, err := r.uploadMediaURL(subCtx, client, url)
			if err != nil {
				return err
			}

			ids[i] = mediaID
			return nil
		})
	}

	if err := group.Wait(); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return ids, nil
}

func (r *ExternalTweetRepository) uploadMediaURL(ctx context.Context, client *twitterClient, url string) (int64, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.uploadMediaURL",
		trace.WithAttributes(key.String("media.url", url)))
	defer span.End()

	data, mediaType, err := r.fetchMedia(ctx, url)
	if err != nil {
		span.RecordError(ctx, err)
		return 0, err
	}

	mediaID, err := r.doUploadMedia(ctx, client, data, mediaType)
	if err != nil {
		span.RecordError(ctx, err)
		return 0, err
	}

	return mediaID, nil
}

func (r *ExternalTweetRepository) fetchMedia(ctx context.Context, url string) ([]byte, string, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.fetchMedia",
		trace.WithAttributes(key.String("media.url", url)))
	defer span.End()

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, "", err
	}

	res, err := r.client.Do(req)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, "", err
	}

	if res.StatusCode > 299 {
		err = fmt.Errorf("unsuccessful status code %d", res.StatusCode)
		span.RecordError(ctx, err)
		return nil, "", err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, "", err
	}

	span.SetAttributes(key.Int("media.data_length", len(data)))

	mediaType := res.Header.Get("Content-Type")
	span.SetAttributes(key.String("media.type", mediaType))
	if mediaType == "" {
		span.RecordError(ctx, ErrNoContentType)
		return nil, "", ErrNoContentType
	}

	return data, mediaType, nil
}

func (r *ExternalTweetRepository) doUploadMedia(ctx context.Context, client *twitterClient, data []byte, mediaType string) (int64, error) {
	ctx, span := tracer.Start(ctx, "ExternalTweetRepository.doUploadMedia",
		trace.WithAttributes(
			key.Int("media.data_length", len(data)),
			key.String("media.type", mediaType)))
	defer span.End()

	result, _, err := client.Media.Upload(data, mediaType)
	if err != nil {
		span.RecordError(ctx, err)
		return 0, err
	}

	span.SetAttributes(key.Int64("media.id", result.MediaID))

	return result.MediaID, nil
}
