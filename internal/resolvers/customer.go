package resolvers

import "github.com/stripe/stripe-go"

type Customer struct {
	customer *stripe.Customer
}

func (c *Customer) EmailAddress() *string {
	return &c.customer.Email
}

func (c *Customer) CreditCard() CreditCard {
	if source := c.customer.DefaultSource; source != nil {
		if source.Type != stripe.PaymentSourceTypeCard {
			return nil
		}

		return &sourceCreditCard{
			card: source.Card,
		}
	}

	if is := c.customer.InvoiceSettings; is != nil {
		if pm := is.DefaultPaymentMethod; pm != nil {
			if pm.Type != stripe.PaymentMethodTypeCard {
				return nil
			}

			return &paymentMethodCreditCard{
				card: pm.Card,
			}
		}
	}

	return nil
}
