import { inject, injectable } from "inversify"
import Stripe from "stripe"

import { CustomerLoader } from "@repositories/customer_repository"
import { SubscriptionLoader } from "@repositories/subscription_repository"
import UserService from "@services/user_service"
import { UserAppMetadata, UserId } from "lib/data/types"
import Environment from "lib/env"
import { EventContext } from "lib/events"

@injectable()
class BillingService {
  private planId: string

  constructor(
    env: Environment,
    @inject(Stripe) private stripe: Stripe,
    private customerLoader: CustomerLoader,
    private subscriptionLoader: SubscriptionLoader,
    private userService: UserService,
    private evt: EventContext
  ) {
    this.planId = env.monthlyPlanId
  }

  async subscribe(
    email?: string | null,
    tokenId?: string | null
  ): Promise<void> {
    await this.evt.with("subscribe_user", async evt => {
      const createNewCustomer = email && tokenId
      evt.add({ "billing.create_new_customer": !!createNewCustomer })

      const existingSubscription = await this.getSubscription()
      evt.add({ "billing.has_subscription": !!existingSubscription })

      if (existingSubscription) {
        evt.add({
          "billing.status": existingSubscription.status,
          "billing.cancel_at_period_end":
            existingSubscription.cancel_at_period_end,
        })

        // TODO handle create new customer with existing subscription
        if (existingSubscription.status === "active") {
          if (existingSubscription.cancel_at_period_end) {
            const subscription = await this.stripe.subscriptions.update(
              existingSubscription.id,
              { cancel_at_period_end: false }
            )
            this.subscriptionLoader.replace(subscription.id, subscription)
            return
          }

          throw new Error(
            "Cannot subscribe: you already have an active subscription"
          )
        }

        if (existingSubscription.status !== "canceled") {
          await this.stripe.subscriptions.del(existingSubscription.id)
        }
      }

      const customerId = createNewCustomer
        ? await this.createCustomer(email as string, tokenId as string)
        : await this.requireExistingCustomer()
      evt.add({ "billing.customer_id": customerId })

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: this.planId }],
        expand: ["latest_invoice.payment_intent"],
      })
      this.subscriptionLoader.prime(subscription.id, subscription)
      evt.add({ "billing.subscription_id": subscription.id })

      await this.userService.update({ stripe_subscription_id: subscription.id })
    })
  }

  async cancel(): Promise<void> {
    await this.evt.with("cancel_subscription", async evt => {
      const userInfo = await this.userService.getUserInfo()
      if (!userInfo.stripe_subscription_id) {
        throw new Error(
          "Cannot cancel subscription: you are not currently subscribed"
        )
      }

      evt.add({ "billing.subscription_id": userInfo.stripe_subscription_id })

      const subscription = await this.stripe.subscriptions.update(
        userInfo.stripe_subscription_id,
        { cancel_at_period_end: true }
      )
      this.subscriptionLoader.replace(subscription.id, subscription)
    })
  }

  async isSubscribed(): Promise<boolean> {
    const metadata = await this.userService.getUserInfo()
    return await this.hasActiveSubscription(metadata)
  }

  async isUserSubscribed(userId: UserId): Promise<boolean> {
    const metadata = await this.userService.getMetadataForUser(userId)
    return await this.hasActiveSubscription(metadata)
  }

  private async hasActiveSubscription({
    stripe_subscription_id,
    subscription_status,
  }: Pick<
    UserAppMetadata,
    "stripe_subscription_id" | "subscription_status"
  >): Promise<boolean> {
    if (subscription_status === "active") {
      return true
    }

    if (!stripe_subscription_id) {
      return false
    }

    const subscription = await this.subscriptionLoader.load(
      stripe_subscription_id
    )
    if (!subscription) {
      return false
    }

    return subscription.status === "active"
  }

  private async createCustomer(
    email: string,
    tokenId: string
  ): Promise<string> {
    return await this.evt.with("create_customer", async evt => {
      evt.add({ "billing.token_id": tokenId })

      const customer = await this.stripe.customers.create({
        email,
        source: tokenId,
      })
      this.customerLoader.prime(customer.id, customer)
      evt.add({ "billing.customer_id": customer.id })

      await this.userService.update({ stripe_customer_id: customer.id })
      return customer.id
    })
  }

  private async requireExistingCustomer(): Promise<string> {
    const userInfo = await this.userService.getUserInfo()
    if (!userInfo.stripe_customer_id) {
      throw new Error("There is no existing payment method to subscribe with")
    }

    return userInfo.stripe_customer_id
  }

  private async getSubscription(): Promise<Stripe.subscriptions.ISubscription | null> {
    const userInfo = await this.userService.getUserInfo()
    if (!userInfo.stripe_subscription_id) {
      return null
    }

    return await this.subscriptionLoader.load(userInfo.stripe_subscription_id)
  }
}

export default BillingService
