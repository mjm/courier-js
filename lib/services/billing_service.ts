import { injectable, inject } from "inversify"
import Stripe from "stripe"
import Environment from "../env"
import { CustomerLoader } from "../repositories/customer_repository"
import UserService from "./user_service"

@injectable()
class BillingService {
  private planId: string

  constructor(
    env: Environment,
    @inject(Stripe) private stripe: Stripe,
    private customerLoader: CustomerLoader,
    private userService: UserService
  ) {
    this.planId = env.monthlyPlanId
  }

  async subscribe(email: string, tokenId: string): Promise<any> {
    console.log("Creating subscription for", email, "with token", tokenId)
    const customer = await this.stripe.customers.create({
      email,
      source: tokenId,
    })
    this.customerLoader.prime(customer.id, customer)

    await this.userService.update({ stripe_customer_id: customer.id })

    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: this.planId }],
      expand: ["latest_invoice.payment_intent"],
    })
    await this.userService.update({ stripe_subscription_id: subscription.id })

    console.log(subscription)
  }
}

export default BillingService
