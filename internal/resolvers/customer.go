package resolvers

import "github.com/stripe/stripe-go"

type Customer struct {
	customer *stripe.Customer
}

func (c *Customer) EmailAddress() *string {
	return &c.customer.Email
}

func (c *Customer) CreditCard() *CreditCard {
	source := c.customer.DefaultSource
	if source == nil {
		return nil
	}

	if source.Type != stripe.PaymentSourceTypeCard {
		return nil
	}

	return &CreditCard{
		card: source.Card,
	}
}
