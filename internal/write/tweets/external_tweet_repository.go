package tweets

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"golang.org/x/net/context/ctxhttp"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/auth"
	"github.com/mjm/courier-js/internal/secret"
	"github.com/mjm/courier-js/internal/trace"
)

type TwitterConfig struct {
	*oauth1.Config
}

func NewTwitterConfigFromSecrets(sk secret.Keeper) (cfg TwitterConfig, err error) {
	ctx := context.Background()

	consumerKey, err := sk.GetSecret(ctx, "twitter-consumer-key")
	if err != nil {
		return
	}

	consumerSecret, err := sk.GetSecret(ctx, "twitter-consumer-secret")
	if err != nil {
		return
	}

	cfg.Config = oauth1.NewConfig(consumerKey, consumerSecret)
	return
}

type ExternalTweetRepository struct {
	authDomain string
	config     TwitterConfig
	http       *http.Client
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
	return &ExternalTweetRepository{
		authDomain: authConfig.AuthDomain,
		config:     twitterConfig,
		http:       conf.Client(context.Background()),
	}
}

func (r *ExternalTweetRepository) Create(ctx context.Context, userID string, tweet *Tweet) (*twitter.Tweet, error) {
	ctx = trace.Start(ctx, "Twitter: Create tweet")
	defer trace.Finish(ctx)

	trace.UserID(ctx, userID)
	trace.TweetID(ctx, tweet.ID)
	trace.Add(ctx, trace.Fields{
		"tweet.action": tweet.Action,
	})

	client, err := r.newClient(ctx, userID)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	switch tweet.Action {
	case ActionTweet:
		mediaIDs, err := r.uploadMediaURLs(ctx, client, tweet.MediaURLs)
		if err != nil {
			trace.Error(ctx, err)
			return nil, err
		}

		trace.AddField(ctx, "tweet.media_id_count", len(mediaIDs))

		postedTweet, res, err := client.Statuses.Update(tweet.Body, &twitter.StatusUpdateParams{
			MediaIds: mediaIDs,
		})
		if err != nil {
			trace.Error(ctx, err)
			return nil, err
		}

		trace.Add(ctx, trace.Fields{
			"tweet.posted_id":         postedTweet.ID,
			"twitter.response.status": res.StatusCode,
		})
		return postedTweet, nil

	case ActionRetweet:
		tweetID, err := strconv.ParseInt(tweet.RetweetID, 10, 64)
		if err != nil {
			trace.Error(ctx, err)
			return nil, err
		}

		trace.AddField(ctx, "tweet.retweet_id", tweetID)

		postedTweet, res, err := client.Statuses.Retweet(tweetID, nil)
		if err != nil {
			trace.Error(ctx, err)
			return nil, err
		}

		trace.Add(ctx, trace.Fields{
			"tweet.posted_id":         postedTweet.ID,
			"twitter.response.status": res.StatusCode,
		})
		return postedTweet, nil
	}

	panic(fmt.Errorf("unknown tweet action %q", tweet.Action))
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
	ctx = trace.Start(ctx, "Auth: Get Twitter credentials")
	defer trace.Finish(ctx)

	trace.UserID(ctx, userID)
	trace.Add(ctx, trace.Fields{
		"auth.domain": r.authDomain,
	})

	u := fmt.Sprintf("https://%s/api/v2/users/%s", r.authDomain, userID)
	req, err := http.NewRequestWithContext(ctx, "GET", u, nil)
	if err != nil {
		trace.Error(ctx, err)
		return "", "", err
	}

	res, err := r.http.Do(req)
	if err != nil {
		trace.Error(ctx, err)
		return "", "", err
	}

	trace.AddField(ctx, "auth.response.status", res.StatusCode)

	if res.StatusCode < http.StatusOK || res.StatusCode >= http.StatusBadRequest {
		err = fmt.Errorf("bad status code %d", res.StatusCode)
		trace.Error(ctx, err)
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
		trace.Error(ctx, err)
		return "", "", err
	}
	if err := res.Body.Close(); err != nil {
		trace.Error(ctx, err)
		return "", "", err
	}

	trace.AddField(ctx, "auth.identity_count", len(user.Identities))

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

	err = fmt.Errorf("no identity found for twitter")
	trace.Error(ctx, err)
	return "", "", err
}

func (r *ExternalTweetRepository) uploadMediaURLs(ctx context.Context, client *twitterClient, urls []string) ([]int64, error) {
	ctx = trace.Start(ctx, "Upload media URLs")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "tweet.media_url_count", len(urls))

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
		trace.Error(ctx, err)
		return nil, err
	}

	return ids, nil
}

func (r *ExternalTweetRepository) uploadMediaURL(ctx context.Context, client *twitterClient, url string) (int64, error) {
	ctx = trace.Start(ctx, "Upload media item")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "media.url", url)

	data, mediaType, err := r.fetchMedia(ctx, url)
	if err != nil {
		trace.Error(ctx, err)
		return 0, err
	}

	mediaID, err := r.doUploadMedia(ctx, client, data, mediaType)
	if err != nil {
		trace.Error(ctx, err)
		return 0, err
	}

	return mediaID, nil
}

func (r *ExternalTweetRepository) fetchMedia(ctx context.Context, url string) ([]byte, string, error) {
	ctx = trace.Start(ctx, "Fetch media contents")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "media.url", url)

	res, err := ctxhttp.Get(ctx, nil, url)
	if err != nil {
		trace.Error(ctx, err)
		return nil, "", err
	}

	trace.AddField(ctx, "media.status_code", res.StatusCode)

	if res.StatusCode > 299 {
		err = fmt.Errorf("unsuccessful status code %d", res.StatusCode)
		trace.Error(ctx, err)
		return nil, "", err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		trace.Error(ctx, err)
		return nil, "", err
	}

	trace.AddField(ctx, "media.data_length", len(data))

	mediaType := res.Header.Get("Content-Type")
	if mediaType == "" {
		err = fmt.Errorf("no content type")
		trace.Error(ctx, err)
		return nil, "", err
	}

	trace.AddField(ctx, "media.type", mediaType)

	return data, mediaType, nil
}

func (r *ExternalTweetRepository) doUploadMedia(ctx context.Context, client *twitterClient, data []byte, mediaType string) (int64, error) {
	ctx = trace.Start(ctx, "Upload media contents")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "media.data_length", len(data))
	trace.AddField(ctx, "media.type", mediaType)

	result, _, err := client.Media.Upload(data, mediaType)
	if err != nil {
		trace.Error(ctx, err)
		return 0, err
	}

	trace.AddField(ctx, "media.id", result.MediaID)

	return result.MediaID, nil
}
