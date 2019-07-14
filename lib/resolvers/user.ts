import {
  UserResolvers,
  CustomerResolvers,
  CreditCardResolvers,
} from "../generated/graphql"

export const User: UserResolvers = {
  async customer({ stripe_customer_id }, {}, { loaders }) {
    if (stripe_customer_id) {
      return await loaders.customers.load(stripe_customer_id)
    } else {
      return null
    }
  },
}

export const Customer: CustomerResolvers = {
  emailAddress(customer) {
    return customer.email || null
  },

  creditCard(customer) {
    if (
      customer.default_source &&
      typeof customer.default_source !== "string" &&
      customer.default_source.object === "card"
    ) {
      return customer.default_source
    }

    return null
  },
}

export const CreditCard: CreditCardResolvers = {
  lastFour({ last4 }) {
    return last4
  },

  expirationMonth({ exp_month }) {
    return exp_month
  },

  expirationYear({ exp_year }) {
    return exp_year
  },
}
