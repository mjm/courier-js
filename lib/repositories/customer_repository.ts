import { inject,injectable } from "inversify"
import Stripe from "stripe"

import Loader, { LoaderBatch } from "../data/loader"

type Customer =
  | Stripe.customers.ICustomer
  | (Stripe.IResourceObject & { deleted: true })

@injectable()
export class CustomerLoader extends Loader<Customer, string> {
  constructor(@inject(Stripe) private stripe: Stripe) {
    super()
  }

  async fetch(ids: string[]): LoaderBatch<Customer> {
    return Promise.all(
      ids.map(id =>
        this.stripe.customers.retrieve(id, { expand: ["default_source"] })
      )
    )
  }
}
