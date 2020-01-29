package pager

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
)

type Cursor string

func (Cursor) ImplementsGraphQLType(name string) bool {
	return name == "Cursor"
}

func (c Cursor) MarshalJSON() ([]byte, error) {
	s := base64.URLEncoding.EncodeToString([]byte(c))
	return json.Marshal(s)
}

func (c *Cursor) UnmarshalGraphQL(input interface{}) error {
	if s, ok := input.(string); ok {
		decoded, err := base64.URLEncoding.DecodeString(s)
		if err != nil {
			return err
		}

		*c = Cursor(decoded)
		return nil
	}

	return fmt.Errorf("cursor was not a string")
}
