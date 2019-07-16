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
    const createNewCustomer = email && tokenId
    const existingSubscription = await this.getSubscription()
    if (existingSubscription) {
      // TODO handle create new customer with existing subscription
      if (existingSubscription.status === "active") {
        if (existingSubscription.cancel_at_period_end) {
          console.log(
            "Reactivating user's canceled but unexpired subscription."
          )
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
        console.log("User has existing non-active subscription, deleting it.")
        await this.stripe.subscriptions.del(existingSubscription.id)
      }
    }

    const customerId = createNewCustomer
      ? await this.createCustomer(email!, tokenId!)
      : await this.requireExistingCustomer()

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

  private async createCustomer(
    email: string,
    tokenId: string
  ): Promise<string> {
    console.log("Creating new subscription with token", tokenId)
    const customer = await this.stripe.customers.create({
      email,
      source: tokenId,
    })
    this.customerLoader.prime(customer.id, customer)

    await this.userService.update({ stripe_customer_id: customer.id })
    return customer.id
  }

  private async requireExistingCustomer(): Promise<string> {
    const userInfo = await this.userService.getUserInfo()
    if (!userInfo.stripe_customer_id) {
      throw new Error("There is no existing payment method to subscribe with")
    }

    console.log(
      "Creating subscription for existing customer",
      userInfo.stripe_customer_id
    )
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
