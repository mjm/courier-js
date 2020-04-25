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

func (r *CustomerRepository) CreateWithPaymentMethod(ctx context.Context, email string, paymentMethodID string) (string, error) {
	ctx, span := tracer.Start(ctx, "CustomerRepository.CreateWithPaymentMethod",
		trace.WithAttributes(paymentMethodIDKey(paymentMethodID)))
	defer span.End()

	cus, err := r.stripe.Customers.New(&stripe.CustomerParams{
		Email:         stripe.String(email),
		PaymentMethod: stripe.String(paymentMethodID),
		InvoiceSettings: &stripe.CustomerInvoiceSettingsParams{
			DefaultPaymentMethod: stripe.String(paymentMethodID),
		},
	})
	if err != nil {
		span.RecordError(ctx, err)
		return "", err
	}

	span.SetAttributes(customerIDKey(cus.ID))
	return cus.ID, nil
}
