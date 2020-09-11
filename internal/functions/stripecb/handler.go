package stripecb

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/webhook"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/kv"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/billing"
	billingevent "github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace/keys"
)

var tracer = global.Tracer("courier.blog/internal/functions/stripecb")

type Handler struct {
	webhookSecret string
	events        event.Sink
	subQueries    billing.SubscriptionQueries
}

func NewHandler(stripeCfg billing2.Config, events event.Sink, subQueries billing.SubscriptionQueries) *Handler {
	return &Handler{
		webhookSecret: stripeCfg.WebhookSecret,
		events:        events,
		subQueries:    subQueries,
	}
}

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	span := trace.SpanFromContext(ctx)

	r.Body = http.MaxBytesReader(w, r.Body, 65536)
	payload, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return status.Errorf(codes.InvalidArgument, err.Error())
	}

	span.SetAttributes(kv.Int("stripe.payload_length", len(payload)))

	evt, err := webhook.ConstructEvent(payload, r.Header.Get("Stripe-Signature"), h.webhookSecret)
	if err != nil {
		return err
	}

	if err := h.handleStripeEvent(ctx, &evt); err != nil {
		return err
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "OK")
	return nil
}

func (h *Handler) handleStripeEvent(ctx context.Context, evt *stripe.Event) error {
	span := trace.SpanFromContext(ctx)
	span.SetAttributes(
		kv.String("stripe.event_id", evt.ID),
		kv.String("stripe.event_type", evt.Type),
		kv.Bool("stripe.livemode", evt.Livemode))

	switch evt.Type {
	case "customer.subscription.updated":
		if evt.Data.PreviousAttributes == nil {
			return nil
		}

		prevPeriodEnd := evt.GetPreviousValue("current_period_end")
		curPeriodEnd := evt.GetObjectValue("current_period_end")
		span.SetAttributes(
			kv.String("stripe.period_end.previous", prevPeriodEnd),
			kv.String("stripe.period_end.current", curPeriodEnd))

		if prevPeriodEnd != "" && prevPeriodEnd != curPeriodEnd {
			return h.fireSubscriptionEvent(ctx, evt, func(subID string, userID string) interface{} {
				return billingevent.SubscriptionRenewed{
					UserId:         userID,
					SubscriptionId: subID,
				}
			})
		}

		if _, ok := evt.Data.PreviousAttributes["cancel_at_period_end"]; ok {
			cancel, ok := evt.Data.Object["cancel_at_period_end"].(bool)
			if !ok {
				return nil
			}
			return h.fireSubscriptionEvent(ctx, evt, func(subID string, userID string) interface{} {
				if cancel {
					return billingevent.SubscriptionCanceled{
						UserId:         userID,
						SubscriptionId: subID,
					}
				}
				return billingevent.SubscriptionReactivated{
					UserId:         userID,
					SubscriptionId: subID,
				}
			})
		}
	case "customer.subscription.deleted":
		return h.fireSubscriptionEvent(ctx, evt, func(subID string, userID string) interface{} {
			return billingevent.SubscriptionExpired{
				UserId:         userID,
				SubscriptionId: subID,
			}
		})
	case "customer.subscription.created":
		return h.fireSubscriptionEvent(ctx, evt, func(subID string, userID string) interface{} {
			return billingevent.SubscriptionCreated{
				UserId:         userID,
				SubscriptionId: subID,
			}
		})
	}

	return nil
}

func (h *Handler) fireSubscriptionEvent(ctx context.Context, evt *stripe.Event, f func(string, string) interface{}) error {
	ctx, span := tracer.Start(ctx, "stripecb.fireSubscriptionEvent")
	defer span.End()

	subID := evt.GetObjectValue("id")
	span.SetAttributes(keys.SubscriptionID(subID))

	userID, err := h.subQueries.GetUserID(ctx, subID)
	if err != nil {
		span.RecordError(ctx, err)
		if err == billing.ErrNoUser {
			return nil
		}
		return err
	}
	span.SetAttributes(keys.UserID(userID))

	e := f(subID, userID)
	span.SetAttributes(kv.String("stripe.emitted_event_type", fmt.Sprintf("%T", e)))
	h.events.Fire(ctx, e)
	return nil
}
