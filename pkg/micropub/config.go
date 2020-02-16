package micropub

import (
	"context"
	"encoding/json"
	"net/http"
)

type Config struct {
	MediaEndpoint string     `json:"media-endpoint,omitempty"`
	PostTypes     []PostType `json:"post-types,omitempty"`
}

type PostType struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func (c *Client) Config(ctx context.Context) (*Config, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.url.String()+"?q=config", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.token)

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var cfg Config
	if err := json.NewDecoder(res.Body).Decode(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
