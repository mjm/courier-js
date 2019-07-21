import React from "react"
import {
  GetSubscriptionStatusComponent,
  SubscriptionStatus,
} from "../lib/generated/graphql-components"
import Loading from "../components/loading"

interface SubscriptionState {
  isSubscribed: boolean
}

const SubscriptionContext = React.createContext<SubscriptionState>({
  isSubscribed: false,
})

interface SubscriptionProviderProps {
  children: React.ReactNode
}
export const SubscriptionProvider = ({
  children,
}: SubscriptionProviderProps) => (
  <GetSubscriptionStatusComponent>
    {({ data, loading }) => {
      if (loading && !(data && data.currentUser)) {
        return <Loading />
      }

      const user = data && data.currentUser
      const statusOverride = user && user.subscriptionStatusOverride
      const status = user && user.subscription && user.subscription.status
      const isSubscribed =
        statusOverride === SubscriptionStatus.Active ||
        status === SubscriptionStatus.Active ||
        status === SubscriptionStatus.Canceled

      return (
        <SubscriptionContext.Provider value={{ isSubscribed }}>
          {children}
        </SubscriptionContext.Provider>
      )
    }}
  </GetSubscriptionStatusComponent>
)

export const useSubscription = () => React.useContext(SubscriptionContext)
