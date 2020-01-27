package billing

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
)

// CustomerLoader loads customer data from Stripe.
type CustomerLoader struct {
	*dataloader.Loader
}

// NewCustomerLoader creates a new customer loader using a Stripe API client.
func NewCustomerLoader(sc *client.API) CustomerLoader {
	return CustomerLoader{
		loader.New("Customer Loader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			results := make([]*dataloader.Result, 0, len(keys))
			for _, key := range keys {
				customer, err := loadCustomer(ctx, sc, key.String())
				if err != nil {
					results = append(results, &dataloader.Result{Error: err})
				} else {
					results = append(results, &dataloader.Result{Data: customer})
				}
			}
			return results
		}),
	}
}

func loadCustomer(ctx context.Context, sc *client.API, id string) (*stripe.Customer, error) {
	ctx = trace.Start(ctx, "Stripe: Get customer")
	defer trace.Finish(ctx)

	trace.Add(ctx, trace.Fields{
		"stripe.customer_id": id,
	})

	params := &stripe.CustomerParams{}
	params.AddExpand("default_source")
	customer, err := sc.Customers.Get(id, params)
	if err != nil {
		trace.Error(ctx, err)
		return nil, err
	}

	return customer, nil
}
