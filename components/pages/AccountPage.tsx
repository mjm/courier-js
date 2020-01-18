import { NextPage } from "next"
import Head from "../Head"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { graphql } from "react-relay"
import UserInfoCard from "components/UserInfoCard"
import SubscriptionInfoCard from "components/SubscriptionInfoCard"
import RecentEventsCard from "components/RecentEventsCard"
import { AccountPageQueryResponse } from "@generated/AccountPageQuery.graphql"
import UserActionsCard from "components/UserActionsCard"

const AccountPage: NextPage<AccountPageQueryResponse> = props => {
  const { currentUser } = props
  if (!currentUser) {
    return null
  }

  return (
    <main className="container mx-auto my-8">
      <Head title="Your Account" />

      <div className="px-3">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 px-3 mb-6">
            <UserInfoCard user={currentUser} />
            <SubscriptionInfoCard user={currentUser} />
            <UserActionsCard />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 px-3">
            <RecentEventsCard events={props} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default withData(withSecurePage(AccountPage), {
  query: graphql`
    query AccountPageQuery {
      currentUser {
        ...UserInfoCard_user
        ...SubscriptionInfoCard_user
      }
      ...RecentEventsCard_events
    }
  `,
})
