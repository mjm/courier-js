import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SubscriptionProvider_user } from "@generated/SubscriptionProvider_user.graphql"

interface SubscriptionState {
  isSubscribed: boolean
}

const SubscriptionContext = React.createContext<SubscriptionState>({
  isSubscribed: false,
})

export const useSubscription = (): SubscriptionState =>
  React.useContext(SubscriptionContext)

interface Props {
  user: SubscriptionProvider_user
  children: React.ReactNode
}

const SubscriptionProvider: React.FC<Props> = ({ user, children }) => {
  const statusOverride = user?.subscriptionStatusOverride
  const status = user?.subscription?.status
  const isSubscribed =
    statusOverride === "ACTIVE" || status === "ACTIVE" || status === "CANCELED"

  return (
    <SubscriptionContext.Provider value={{ isSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export default createFragmentContainer(SubscriptionProvider, {
  user: graphql`
    fragment SubscriptionProvider_user on User {
      subscription {
        status
      }
      subscriptionStatusOverride
    }
  `,
})
