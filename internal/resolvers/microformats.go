package resolvers

type MicroformatPage struct {
}

func (mp *MicroformatPage) AuthorizationEndpoint() *string {
	return nil
}

func (mp *MicroformatPage) TokenEndpoint() *string {
	return nil
}
