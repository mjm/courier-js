package micropub

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
)

var (
	ErrInvalidUpdate = errors.New("invalid micropub update")
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
	ctx, span := tracer.Start(ctx, "micropub.Update",
		trace.WithAttributes(kv.String("micropub.entry_url", update.URL)))
	defer span.End()

	if !update.Valid() {
		span.RecordError(ctx, ErrInvalidUpdate)
		return nil, ErrInvalidUpdate
	}

	var payload struct {
		Action string `json:"action"`
		Update
	}
	payload.Action = "update"
	payload.Update = update

	var body bytes.Buffer
	if err := json.NewEncoder(&body).Encode(payload); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(endpointKey(c.url.String()))
	req, err := http.NewRequestWithContext(ctx, "POST", c.url.String(), &body)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	span.SetAttributes(kv.Int("micropub.token_length", len(c.token)))
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusNoContent {
		return nil, nil
	}

	if res.StatusCode != http.StatusOK {
		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			span.RecordError(ctx, err)
			return nil, err
		}

		err = fmt.Errorf("unexpected response %d, error: %s", res.StatusCode, string(b))
		span.RecordError(ctx, err)
		return nil, err
	}

	var v interface{}
	if err := json.NewDecoder(res.Body).Decode(&v); err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	return v, nil
}
