import React from "react"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import { SubscriptionProvider_user$key } from "@generated/SubscriptionProvider_user.graphql"

interface SubscriptionState {
  isSubscribed: boolean
}

const SubscriptionContext = React.createContext<SubscriptionState>({
  isSubscribed: false,
})

export const useSubscription = (): SubscriptionState =>
  React.useContext(SubscriptionContext)

interface Props {
  user: SubscriptionProvider_user$key
  children: React.ReactNode
}

const SubscriptionProvider: React.FC<Props> = ({ user, children }) => {
  const data = useFragment(
    graphql`
      fragment SubscriptionProvider_user on Viewer {
        subscription {
          status
        }
        subscriptionStatusOverride
      }
    `,
    user
  )

  const statusOverride = data?.subscriptionStatusOverride
  const status = data?.subscription?.status
  const isSubscribed =
    statusOverride === "ACTIVE" || status === "ACTIVE" || status === "CANCELED"

  return (
    <SubscriptionContext.Provider value={{ isSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export default SubscriptionProvider
