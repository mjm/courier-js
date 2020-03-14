package billing

import (
	"context"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/client"
	"go.opentelemetry.io/otel/api/trace"
)

type CustomerRepository struct {
	stripe *client.API
}

func NewCustomerRepository(stripe *client.API) *CustomerRepository {
	return &CustomerRepository{stripe: stripe}
}

func (r *CustomerRepository) Create(ctx context.Context, email string, tokenID string) (string, error) {
	ctx, span := tracer.Start(ctx, "CustomerRepository.Create",
		trace.WithAttributes(tokenIDKey(tokenID)))
	defer span.End()

	cus, err := r.stripe.Customers.New(&stripe.CustomerParams{
		Email: &email,
		Source: &stripe.SourceParams{
			Token: &tokenID,
		},
	})
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(customerIDKey(cus.ID))
	return cus.ID, nil
}
