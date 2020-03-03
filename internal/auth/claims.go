package auth

import "gopkg.in/dgrijalva/jwt-go.v3"

type Claims struct {
	jwt.StandardClaims

	// our audience values are arrays
	Audience []string `json:"aud,omitempty"`

	// custom app-specific claims
	StripeCustomerID     string   `json:"https://courier.blog/customer_id,omitempty"`
	StripeSubscriptionID string   `json:"https://courier.blog/subscription_id,omitempty"`
	SubscriptionStatus   string   `json:"https://courier.blog/status,omitempty"`
	MicropubSites        []string `json:"https://courier.blog/micropub_sites,omitempty"`
}

func (c *Claims) Valid() error {
	if err := c.StandardClaims.Valid(); err != nil {
		return err
	}

	// TODO validate audience and issuer
	return nil
}
