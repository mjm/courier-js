package resolvers

import "github.com/stripe/stripe-go"

type CreditCard struct {
	card *stripe.Card
}

func (cc *CreditCard) Brand() string {
	return string(cc.card.Brand)
}

func (cc *CreditCard) LastFour() string {
	return cc.card.Last4
}

func (cc *CreditCard) ExpirationMonth() int32 {
	return int32(cc.card.ExpMonth)
}

func (cc *CreditCard) ExpirationYear() int32 {
	return int32(cc.card.ExpYear)
}
