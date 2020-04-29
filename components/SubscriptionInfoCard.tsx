import Moment from "react-moment"
import { graphql } from "react-relay"
import { useFragment, useRelayEnvironment } from "react-relay/hooks"

import Link from "next/link"

import { SubscriptionInfoCard_user$key } from "@generated/SubscriptionInfoCard_user.graphql"
import { cancelSubscription } from "@mutations/CancelSubscription"
import AsyncButton from "components/AsyncButton"
import CreditCardIcon from "components/CreditCardIcon"

const SubscriptionInfoCard: React.FC<{
  user: SubscriptionInfoCard_user$key
}> = ({ user }) => {
  const environment = useRelayEnvironment()
  const { customer, subscription, subscriptionStatusOverride } = useFragment(
    graphql`
      fragment SubscriptionInfoCard_user on Viewer {
        customer {
          creditCard {
            brand
            lastFour
          }
        }
        subscription {
          status
          periodEnd
        }
        subscriptionStatusOverride
      }
    `,
    user
  )

  async function cancel(): Promise<void> {
    try {
      await cancelSubscription(environment)
    } catch (err) {
      console.error(err)
    }
  }

  if (!subscription && !subscriptionStatusOverride) {
    return (
      <Link href="/subscribe">
        <a className="btn btn-first btn-first-primary block w-full text-center text-base mb-4">
          Subscribe now
        </a>
      </Link>
    )
  }

  const status = subscription?.status ?? subscriptionStatusOverride
  if (status === "ACTIVE") {
    return (
      <div className="rounded-lg shadow-md bg-neutral-1 p-4 text-neutral-7 text-sm mb-4">
        <div>
          {subscription ? (
            <>
              Subscription renews{" "}
              <Moment
                fromNow
                className="inline-block font-medium text-primary-9"
              >
                {subscription.periodEnd}
              </Moment>
            </>
          ) : (
            <>Subscribed indefinitely</>
          )}
        </div>
        {customer?.creditCard && (
          <div className="mt-3 flex flex-row justify-between items-baseline">
            <div>
              <CreditCardIcon brand={customer.creditCard.brand} />
              <span className="ml-1 font-medium">
                {customer.creditCard.lastFour}
              </span>
            </div>
            <AsyncButton
              onClick={cancel}
              className="btn btn-third btn-third-neutral font-medium border-0 py-0"
            >
              Cancel
            </AsyncButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg shadow-md bg-neutral-1 p-4 text-neutral-7 text-sm mb-4">
      <div>
        {subscription ? (
          <>
            Subscription {status === "CANCELED" ? "expires" : "expired"}{" "}
            {subscription.periodEnd && (
              <Moment
                fromNow
                className="inline-block font-medium text-primary-9"
              >
                {subscription.periodEnd}
              </Moment>
            )}
          </>
        ) : (
          <>Subscription {status === "CANCELED" ? "expires soon" : "expired"}</>
        )}
      </div>
      <div className="mt-3 flex flex-row justify-between items-baseline">
        <Link href="/subscribe">
          <a className="btn btn-first btn-first-primary font-medium w-full text-center">
            Resubscribe
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SubscriptionInfoCard
