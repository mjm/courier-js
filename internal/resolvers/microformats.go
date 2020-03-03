package resolvers

import (
	"willnorris.com/go/microformats"
)

type MicroformatPage struct {
	data *microformats.Data
}

func (mp *MicroformatPage) AuthorizationEndpoint() *string {
	return mp.getRel("authorization_endpoint")
}

func (mp *MicroformatPage) TokenEndpoint() *string {
	return mp.getRel("token_endpoint")
}

func (mp *MicroformatPage) getRel(key string) *string {
	rels, ok := mp.data.Rels[key]
	if !ok {
		return nil
	}

	if len(rels) == 0 {
		return nil
	}

	return &rels[0]
}
