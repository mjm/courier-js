package user

import (
	"context"

	"gopkg.in/auth0.v3/management"

	"github.com/mjm/courier-js/internal/trace"
)

type UserRepository struct {
	management *management.Management
}

func NewUserRepository(m *management.Management) *UserRepository {
	return &UserRepository{management: m}
}

type UpdateMetadataParams struct {
	UserID string
	AppMetadataParams
	UserMetadataParams
}

type AppMetadataParams struct {
	CustomerID     *string
	SubscriptionID *string
}

func (p AppMetadataParams) apply(u *management.User) {
	u.AppMetadata = make(map[string]interface{})
	if p.CustomerID != nil {
		u.AppMetadata["stripe_customer_id"] = *p.CustomerID
	}
	if p.SubscriptionID != nil {
		u.AppMetadata["stripe_subscription_id"] = *p.SubscriptionID
	}
}

type UserMetadataParams struct {
	MicropubTokens map[string]string
}

func (p UserMetadataParams) apply(u *management.User) {
	u.UserMetadata = make(map[string]interface{})
	if p.MicropubTokens != nil {
		u.UserMetadata["micropub_tokens"] = p.MicropubTokens
	}
}

func (r *UserRepository) Update(ctx context.Context, params UpdateMetadataParams) error {
	ctx = trace.Start(ctx, "Auth0: Update user")
	defer trace.Finish(ctx)

	trace.UserID(ctx, params.UserID)

	u := &management.User{}
	params.AppMetadataParams.apply(u)
	params.UserMetadataParams.apply(u)

	if err := r.management.User.Update(params.UserID, u); err != nil {
		trace.Error(ctx, err)
		return err
	}
	return nil
}
