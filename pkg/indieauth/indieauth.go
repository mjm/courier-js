package indieauth

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"

	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
)

type Data struct {
	TokenEndpoint string `json:"tokenEndpoint"`
	Nonce         string `json:"nonce"`
	Me            string `json:"me"`
	ClientID      string `json:"clientID"`
	RedirectURI   string `json:"redirectURI"`
	Origin        string `json:"origin"`
}

type Result struct {
	Origin string `json:"origin"`
	URL    string `json:"url"`
	Token  string `json:"token"`
}

var (
	ErrNoCode  = errors.New("code is required")
	ErrNoState = errors.New("state is required")
	ErrStale   = errors.New("stale login attempt")
)

var tracer = global.TraceProvider().Tracer("courier.blog/pkg/indieauth")

var (
	codeLenKey  = kv.Key("code_length").Int
	stateLenKey = kv.Key("state_length").Int
	dataLenKey  = kv.Key("data_length").Int

	tokenEndpointKey = kv.Key("data.token_endpoint").String
	meKey            = kv.Key("data.me").String
	clientIDKey      = kv.Key("data.client_id").String
	redirectURIKey   = kv.Key("data.redirect_uri").String
	originKey        = kv.Key("data.origin").String
)

func CompleteRequest(ctx context.Context, r *http.Request) (*Result, error) {
	ctx, span := tracer.Start(ctx, "indieauth.CompleteRequest")
	defer span.End()

	c, err := r.Cookie("indieauth")
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	encodedData, err := url.QueryUnescape(c.Value)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(dataLenKey(len(encodedData)))

	q := r.URL.Query()
	code, state := q.Get("code"), q.Get("state")

	span.SetAttributes(codeLenKey(len(code)), stateLenKey(len(state)))

	return Complete(ctx, code, state, encodedData)
}

func Complete(ctx context.Context, code string, state string, dataStr string) (*Result, error) {
	ctx, span := tracer.Start(ctx, "indieauth.Complete",
		trace.WithAttributes(
			codeLenKey(len(code)),
			stateLenKey(len(state)),
			dataLenKey(len(dataStr))))
	defer span.End()

	if code == "" {
		span.RecordError(ctx, ErrNoCode)
		return nil, ErrNoCode
	}
	if state == "" {
		span.RecordError(ctx, ErrNoState)
		return nil, ErrNoState
	}

	var data Data
	if err := json.Unmarshal([]byte(dataStr), &data); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(
		tokenEndpointKey(data.TokenEndpoint),
		meKey(data.Me),
		clientIDKey(data.ClientID),
		redirectURIKey(data.RedirectURI),
		originKey(data.Origin))

	if state != data.Nonce {
		span.RecordError(ctx, ErrStale)
		return nil, ErrStale
	}

	v := make(url.Values)
	v.Set("grant_type", "authorization_code")
	v.Set("code", code)
	v.Set("client_id", data.ClientID)
	v.Set("redirect_uri", data.RedirectURI)
	v.Set("me", data.Me)

	tokenURL := data.TokenEndpoint + "?" + v.Encode()
	req, err := http.NewRequestWithContext(ctx, "POST", tokenURL, nil)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}
	defer res.Body.Close()

	var resData struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(res.Body).Decode(&resData); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return &Result{
		Origin: data.Origin,
		URL:    data.Me,
		Token:  resData.AccessToken,
	}, nil
}
