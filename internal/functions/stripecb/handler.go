package stripecb

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/stripe/stripe-go"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/read/billing"
	billingevent "github.com/mjm/courier-js/internal/shared/billing"
	"github.com/mjm/courier-js/internal/trace"
)

type Handler struct {
	eventBus   *event.Bus
	subQueries billing.SubscriptionQueries
}

func NewHandler(traceCfg trace.Config, eventBus *event.Bus, subQueries billing.SubscriptionQueries, _ *event.Publisher) *Handler {
	trace.Init(traceCfg)

	return &Handler{
		eventBus:   eventBus,
		subQueries: subQueries,
	}
}

func (h *Handler) HandleHTTP(w http.ResponseWriter, r *http.Request) {
	defer trace.Flush()

	ctx := trace.Start(r.Context(), "Stripe webhook event")
	defer trace.Finish(ctx)

	var evt stripe.Event
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		trace.Error(ctx, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := h.handleStripeEvent(ctx, &evt); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "OK")
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
	h.eventBus.Fire(ctx, e)
	return nil
}
