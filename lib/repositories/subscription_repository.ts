import { injectable, inject } from "inversify"
import Loader, { LoaderBatch } from "../data/loader"
import Stripe from "stripe"

@injectable()
export class SubscriptionLoader extends Loader<
  Stripe.subscriptions.ISubscription,
  string
> {
  constructor(@inject(Stripe) private stripe: Stripe) {
    super()
  }

  async fetch(ids: string[]): LoaderBatch<Stripe.subscriptions.ISubscription> {
    return Promise.all(ids.map(id => this.stripe.subscriptions.retrieve(id)))
  }
}
