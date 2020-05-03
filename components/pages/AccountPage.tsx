import { graphql } from "react-relay"
import { usePreloadedQuery } from "react-relay/hooks"

import { NextPage } from "next"

import { AccountPageQuery } from "@generated/AccountPageQuery.graphql"
import Head from "components/Head"
import RecentEventsCard from "components/RecentEventsCard"
import SubscriptionInfoCard from "components/SubscriptionInfoCard"
import UserActionsCard from "components/UserActionsCard"
import UserInfoCard from "components/UserInfoCard"
import withSecurePage from "hocs/withSecurePage"
import { preloader } from "utils/preloader"

const AccountPage: NextPage = () => {
  const data = usePreloadedQuery<AccountPageQuery>(
    graphql`
      query AccountPageQuery {
        viewer {
          ...UserInfoCard_user
          ...SubscriptionInfoCard_user
        }
        ...RecentEventsCard_events
      }
    `,
    preloader.get("/account")
  )

  return (
    <main className="container mx-auto my-8">
      <Head title="Your Account" />

      <div className="px-3">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 px-3 mb-6">
            {data?.viewer && (
              <>
                <UserInfoCard user={data.viewer} />
                <SubscriptionInfoCard user={data.viewer} />
              </>
            )}
            <UserActionsCard />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 px-3">
            {data && <RecentEventsCard events={data} />}
          </div>
        </div>
      </div>
    </main>
  )
}

export default withSecurePage(AccountPage)
