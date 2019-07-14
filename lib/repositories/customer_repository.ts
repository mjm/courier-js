import { injectable, inject } from "inversify"
import Loader, { LoaderBatch } from "../data/loader"
import Stripe from "stripe"

@injectable()
export class CustomerLoader extends Loader<Stripe.customers.ICustomer, string> {
  constructor(@inject(Stripe) private stripe: Stripe) {
    super()
  }

  async fetch(ids: string[]): LoaderBatch<Stripe.customers.ICustomer> {
    return Promise.all(
      ids.map(id =>
        this.stripe.customers.retrieve(id, { expand: ["default_source"] })
      )
    )
  }
}
