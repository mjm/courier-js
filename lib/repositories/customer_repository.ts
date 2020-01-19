import { injectable, inject } from "inversify"
import Loader, { LoaderBatch } from "../data/loader"
import Stripe from "stripe"

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
