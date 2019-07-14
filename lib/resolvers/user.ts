import {
  UserResolvers,
  CustomerResolvers,
  CreditCardResolvers,
  UserSubscriptionResolvers,
  SubscriptionStatus,
} from "../generated/graphql"
import moment from "moment"

export const User: UserResolvers = {
  async customer({ stripe_customer_id }, {}, { loaders }) {
    if (stripe_customer_id) {
      return await loaders.customers.load(stripe_customer_id)
    } else {
      return null
    }
  },

  async subscription({ stripe_subscription_id }, {}, { loaders }) {
    if (stripe_subscription_id) {
      return await loaders.subscriptions.load(stripe_subscription_id)
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

export const UserSubscription: UserSubscriptionResolvers = {
  status(subscription) {
    if (subscription.status === "active") {
      if (subscription.cancel_at_period_end) {
        return SubscriptionStatus.Canceled
      } else {
        return SubscriptionStatus.Active
      }
    }

    if (subscription.status === "canceled") {
      return SubscriptionStatus.Expired
    }

    return SubscriptionStatus.Inactive
  },

  periodEnd(subscription) {
    return moment
      .unix(subscription.current_period_end)
      .utc()
      .toDate()
  },
}
