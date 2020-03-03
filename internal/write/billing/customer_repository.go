package billing

import (
	"context"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"

	"github.com/mjm/courier-js/internal/trace"
)

type CustomerRepository struct {
	stripe *client.API
}

func NewCustomerRepository(stripe *client.API) *CustomerRepository {
	return &CustomerRepository{stripe: stripe}
}

func (r *CustomerRepository) Create(ctx context.Context, email string, tokenID string) (string, error) {
	ctx = trace.Start(ctx, "Stripe: Create customer")
	defer trace.Finish(ctx)

	trace.AddField(ctx, "stripe.token_id", tokenID)
	cus, err := r.stripe.Customers.New(&stripe.CustomerParams{
		Email: &email,
		Source: &stripe.SourceParams{
			Token: &tokenID,
		},
	})
	if err != nil {
		trace.Error(ctx, err)
		return "", err
	}

	trace.AddField(ctx, "stripe.customer_id", cus.ID)
	return cus.ID, nil
}
