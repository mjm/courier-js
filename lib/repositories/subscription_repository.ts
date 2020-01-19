import { inject,injectable } from "inversify"
import Stripe from "stripe"

import Loader, { LoaderBatch } from "../data/loader"

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
