package micropub

import (
	"net/http"
	"net/url"
)

type Client struct {
	HTTPClient *http.Client
	url        *url.URL
	token      string
}

func NewClient(u *url.URL, token string) *Client {
	return &Client{
		HTTPClient: http.DefaultClient,
		url:        u,
		token:      token,
	}
}
