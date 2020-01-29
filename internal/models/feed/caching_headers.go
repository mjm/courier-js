package feed

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type CachingHeaders struct {
	Etag         string `json:"etag,omitempty"`
	LastModified string `json:"lastModified,omitempty"`
}

func (h CachingHeaders) Value() (driver.Value, error) {
	return json.Marshal(h)
}

func (h *CachingHeaders) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("CachingHeaders must be scanned from []byte")
	}

	return json.Unmarshal(b, &h)
}
