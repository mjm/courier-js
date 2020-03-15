package micropub

import (
	"net/http"
	"net/url"

	"github.com/mjm/courier-js/pkg/tracehttp"
)

type Client struct {
	HTTPClient *http.Client
	url        *url.URL
	token      string
}

func NewClient(u *url.URL, token string) *Client {
	return &Client{
		HTTPClient: &http.Client{
			Transport: tracehttp.DefaultTransport,
		},
		url:   u,
		token: token,
	}
}
