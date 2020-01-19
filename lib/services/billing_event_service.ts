import { injectable } from "inversify"
import Stripe from "stripe"
import UserService from "./user_service"
import { EventType } from "../data/types"
import { User } from "auth0"
import EventService from "./event_service"

@injectable()
class BillingEventService {
  constructor(private users: UserService, private events: EventService) {}

  async processEvent(event: Stripe.events.IEvent): Promise<void> {
    let subscription: Stripe.subscriptions.ISubscription

    switch (event.type) {
      case "customer.subscription.updated": {
        // Some reasons we might care about this event:
        // - The subscription renewed automatically
        // - The user canceled the subscription
        subscription = event.data.object as Stripe.subscriptions.ISubscription
        const eventType = this.getEventTypeForUpdate(
          subscription,
          event.data.previous_attributes
        )
        if (!eventType) {
          // We don't care about this update for recording events
          return
        }

        await this.recordSubscriptionEvent(eventType, subscription)
        break
      }

      case "customer.subscription.deleted":
        // The user canceled the subscription and later the period ended
        subscription = event.data.object as Stripe.subscriptions.ISubscription
        await this.recordSubscriptionEvent("subscription_expire", subscription)
        break

      case "customer.subscription.created":
        // The user created a new subscription
        subscription = event.data.object as Stripe.subscriptions.ISubscription
        await this.recordSubscriptionEvent("subscription_create", subscription)
        break
    }
  }

  private getEventTypeForUpdate(
    subscription: Stripe.subscriptions.ISubscription,
    previousAttrs: Stripe.events.IEvent["data"]["previous_attributes"]
  ): EventType | undefined {
    if (!previousAttrs) {
      return undefined
    }

    if (
      "current_period_end" in previousAttrs &&
      previousAttrs.current_period_end !== subscription.current_period_end
    ) {
      return "subscription_renew"
    }

    if ("cancel_at_period_end" in previousAttrs) {
      if (subscription.cancel_at_period_end) {
        return "subscription_cancel"
      } else {
        return "subscription_reactivate"
      }
    }

    return undefined
  }

  private async recordSubscriptionEvent(
    eventType: EventType,
    subscription: Stripe.subscriptions.ISubscription
  ): Promise<void> {
    let user: User
    try {
      user = await this.users.findBySubscriptionId(subscription.id)
    } catch (e) {
      console.warn(
        `Could not find a user with subscription ID ${subscription.id}`
      )
      return
    }

    await this.events.record(
      eventType,
      { subscriptionId: subscription.id },
      { asUser: user.user_id }
    )
  }
}

export default BillingEventService
