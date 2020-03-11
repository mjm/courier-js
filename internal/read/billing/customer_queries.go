package billing

import (
	"context"

	"github.com/graph-gophers/dataloader"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/loader"
	"github.com/mjm/courier-js/internal/trace"
)

type CustomerQueries interface {
	Get(context.Context, string) (*stripe.Customer, error)
}

type customerQueries struct {
	stripe *client.API
	loader *dataloader.Loader
}

func NewCustomerQueries(sc *client.API) CustomerQueries {
	return &customerQueries{
		stripe: sc,
		loader: newCustomerLoader(sc),
	}
}

func newCustomerLoader(sc *client.API) *dataloader.Loader {
	return loader.New("CustomerLoader", func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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
	})
}

func (q *customerQueries) Get(ctx context.Context, id string) (*stripe.Customer, error) {
	v, err := q.loader.Load(ctx, dataloader.StringKey(id))()
	if err != nil {
		return nil, err
	}
	return v.(*stripe.Customer), nil
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
