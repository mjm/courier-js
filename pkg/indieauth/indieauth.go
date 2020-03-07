package indieauth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
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

func CompleteRequest(ctx context.Context, r *http.Request) (*Result, error) {
	c, err := r.Cookie("indieauth")
	if err != nil {
		return nil, err
	}

	encodedData, err := url.QueryUnescape(c.Value)
	if err != nil {
		return nil, err
	}

	q := r.URL.Query()
	code, state := q.Get("code"), q.Get("state")

	return Complete(ctx, code, state, encodedData)
}

func Complete(ctx context.Context, code string, state string, dataStr string) (*Result, error) {
	if code == "" {
		return nil, fmt.Errorf("query parameter %q is required", "code")
	}
	if state == "" {
		return nil, fmt.Errorf("query parameter %q is required", "state")
	}

	var data Data
	if err := json.Unmarshal([]byte(dataStr), &data); err != nil {
		return nil, err
	}

	if state != data.Nonce {
		return nil, fmt.Errorf("stale login attempt")
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
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var resData struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(res.Body).Decode(&resData); err != nil {
		return nil, err
	}

	return &Result{
		Origin: data.Origin,
		URL:    data.Me,
		Token:  resData.AccessToken,
	}, nil
}
