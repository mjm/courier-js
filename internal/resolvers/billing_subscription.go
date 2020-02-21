package resolvers

import (
	"time"

	"github.com/mjm/graphql-go"
	"github.com/stripe/stripe-go"
)

type Subscription struct {
	sub *stripe.Subscription
}

func (s *Subscription) Status() string {
	switch s.sub.Status {
	case stripe.SubscriptionStatusActive:
		if s.sub.CancelAtPeriodEnd {
			return "CANCELED"
		}
		return "ACTIVE"

	case stripe.SubscriptionStatusCanceled:
		return "EXPIRED"
	}

	return "INACTIVE"
}

func (s *Subscription) PeriodEnd() graphql.Time {
	return graphql.Time{
		Time: time.Unix(s.sub.CurrentPeriodEnd, 0),
	}
}
