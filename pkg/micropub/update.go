package micropub

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Update struct {
	URL     string                   `json:"url"`
	Replace map[string][]interface{} `json:"replace,omitempty"`
	Add     map[string][]interface{} `json:"add,omitempty"`
	Delete  interface{}              `json:"delete,omitempty"`
}

func (u Update) Valid() bool {
	return u.URL != "" && (u.Replace != nil || u.Add != nil || u.Delete != nil)
}

func (c *Client) Update(ctx context.Context, update Update) (interface{}, error) {
	if !update.Valid() {
		return nil, fmt.Errorf("invalid micropub update")
	}

	var payload struct {
		Action string `json:"action"`
		Update
	}
	payload.Action = "update"
	payload.Update = update

	var body bytes.Buffer
	if err := json.NewEncoder(&body).Encode(payload); err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.url.String(), &body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusNoContent {
		return nil, nil
	}

	if res.StatusCode != http.StatusOK {
		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("unexpected response %d, error: %s", res.StatusCode, string(b))
	}

	var v interface{}
	if err := json.NewDecoder(res.Body).Decode(&v); err != nil {
		return nil, err
	}

	return v, nil
}
