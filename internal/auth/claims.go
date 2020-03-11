package auth

import (
	"errors"
	"fmt"

	"gopkg.in/dgrijalva/jwt-go.v3"
)

var (
	ErrInvalidIssuer   = errors.New("token has invalid issuer")
	ErrInvalidAudience = errors.New("token is missing required audience")
)

type ClaimsExpectations struct {
	AuthDomain    string
	APIIdentifier string
}

type Claims struct {
	jwt.StandardClaims

	Expectations ClaimsExpectations

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

	expectedIssuer := fmt.Sprintf("https://%s/", c.Expectations.AuthDomain)
	if !c.VerifyIssuer(expectedIssuer, true) {
		return fmt.Errorf("%w: expected issuer %q, but got %q", ErrInvalidIssuer, expectedIssuer, c.Issuer)
	}

	expectedAudience := c.Expectations.APIIdentifier
	var found bool
	for _, aud := range c.Audience {
		if aud == expectedAudience {
			found = true
			break
		}
	}

	if !found {
		return fmt.Errorf("%w: %q", ErrInvalidAudience, expectedAudience)
	}

	return nil
}
