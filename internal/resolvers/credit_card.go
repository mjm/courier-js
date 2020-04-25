package resolvers

import "github.com/stripe/stripe-go"

type CreditCard interface {
	Brand() string
	LastFour() string
	ExpirationMonth() int32
	ExpirationYear() int32
}

type sourceCreditCard struct {
	card *stripe.Card
}

func (cc *sourceCreditCard) Brand() string {
	return string(cc.card.Brand)
}

func (cc *sourceCreditCard) LastFour() string {
	return cc.card.Last4
}

func (cc *sourceCreditCard) ExpirationMonth() int32 {
	return int32(cc.card.ExpMonth)
}

func (cc *sourceCreditCard) ExpirationYear() int32 {
	return int32(cc.card.ExpYear)
}

type paymentMethodCreditCard struct {
	card *stripe.PaymentMethodCard
}

func (cc *paymentMethodCreditCard) Brand() string {
	return string(cc.card.Brand)
}

func (cc *paymentMethodCreditCard) LastFour() string {
	return cc.card.Last4
}

func (cc *paymentMethodCreditCard) ExpirationMonth() int32 {
	return int32(cc.card.ExpMonth)
}

func (cc *paymentMethodCreditCard) ExpirationYear() int32 {
	return int32(cc.card.ExpYear)
}
