import { injectable, inject } from "inversify"
import Stripe from "stripe"
import Environment from "../env"
import { CustomerLoader } from "../repositories/customer_repository"
import UserService from "./user_service"
import { SubscriptionLoader } from "../repositories/subscription_repository"

@injectable()
class BillingService {
  private planId: string

  constructor(
    env: Environment,
    @inject(Stripe) private stripe: Stripe,
    private customerLoader: CustomerLoader,
    private subscriptionLoader: SubscriptionLoader,
    private userService: UserService
  ) {
    this.planId = env.monthlyPlanId
  }

  async subscribe(
    email?: string | null,
    tokenId?: string | null
  ): Promise<any> {
    let customerId: string
    if (email && tokenId) {
      console.log("Creating subscription for", email, "with token", tokenId)
      const customer = await this.stripe.customers.create({
        email,
        source: tokenId,
      })
      this.customerLoader.prime(customer.id, customer)
      customerId = customer.id

      await this.userService.update({ stripe_customer_id: customerId })
    } else {
      const userInfo = await this.userService.getUserInfo()
      if (!userInfo.stripe_customer_id) {
        throw new Error("There is no existing payment method to subscribe with")
      }
      customerId = userInfo.stripe_customer_id

      console.log("Creating subscription for existing customer", customerId)
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: this.planId }],
      expand: ["latest_invoice.payment_intent"],
    })
    this.subscriptionLoader.prime(subscription.id, subscription)

    await this.userService.update({ stripe_subscription_id: subscription.id })
  }

  async cancel(): Promise<void> {
    const userInfo = await this.userService.getUserInfo()
    if (!userInfo.stripe_subscription_id) {
      throw new Error(
        "Cannot cancel subscription: you are not currently subscribed"
      )
    }

    const subscription = await this.stripe.subscriptions.update(
      userInfo.stripe_subscription_id,
      { cancel_at_period_end: true }
    )
    this.subscriptionLoader.replace(subscription.id, subscription)
  }
}

export default BillingService
