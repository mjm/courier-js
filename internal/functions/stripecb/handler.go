package stripecb

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/webhook"

	billing2 "github.com/mjm/courier-js/internal/billing"
	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/read/billing"
	billingevent "github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace"
)

type Handler struct {
	webhookSecret string
	events        event.Sink
	subQueries    billing.SubscriptionQueries
}

func NewHandler(traceCfg trace.Config, stripeCfg billing2.Config, events event.Sink, subQueries billing.SubscriptionQueries, _ *event.Publisher) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		webhookSecret: stripeCfg.WebhookSecret,
		events:        events,
		subQueries:    subQueries,
	}
}

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	r.Body = http.MaxBytesReader(w, r.Body, 65536)
	payload, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return functions.WrapHTTPError(err, http.StatusBadRequest)
	}

	trace.AddField(ctx, "stripe.payload_length", len(payload))

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
	trace.AddField(ctx, "stripe.event_id", evt.ID)
	trace.AddField(ctx, "stripe.event_type", evt.Type)
	trace.AddField(ctx, "stripe.account_id", evt.Account)
	trace.AddField(ctx, "stripe.livemode", evt.Livemode)

	switch evt.Type {
	case "customer.subscription.updated":
		if evt.Data.PreviousAttributes == nil {
			return nil
		}

		prevPeriodEnd := evt.GetPreviousValue("current_period_end")
		curPeriodEnd := evt.GetObjectValue("current_period_end")
		trace.Add(ctx, trace.Fields{
			"stripe.period_end.previous": prevPeriodEnd,
			"stripe.period_end.current":  curPeriodEnd,
		})

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
	subID := evt.GetObjectValue("id")
	trace.SubscriptionID(ctx, subID)

	userID, err := h.subQueries.GetUserID(ctx, subID)
	if err != nil {
		trace.Error(ctx, err)
		if err == billing.ErrNoUser {
			return nil
		}
		return err
	}
	trace.UserID(ctx, userID)

	e := f(subID, userID)
	trace.AddField(ctx, "stripe.emitted_event_type", fmt.Sprintf("%T", e))
	h.events.Fire(ctx, e)
	return nil
}
