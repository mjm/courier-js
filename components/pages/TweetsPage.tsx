import React from "react"
import { graphql } from "react-relay"
import { preloadQuery, usePreloadedQuery } from "react-relay/hooks"

import { NextPage } from "next"
import Link from "next/link"

import { useTweetCanceledEvent } from "@events/TweetCanceledEvent"
import { useTweetEditedEvent } from "@events/TweetEditedEvent"
import { useTweetPostedEvent } from "@events/TweetPostedEvent"
import { useTweetUncanceledEvent } from "@events/TweetUncanceledEvent"
import pageQuery, { TweetsPageQuery } from "@generated/TweetsPageQuery.graphql"
import Head from "components/Head"
import Loading from "components/Loading"
import Notice from "components/Notice"
import SubscriptionProvider, {
  useSubscription,
} from "components/SubscriptionProvider"
import TweetList from "components/TweetList"
import { getEnvironment } from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

let preloadedQuery = preloadQuery<TweetsPageQuery>(
  getEnvironment(),
  pageQuery,
  {},
  { fetchPolicy: "store-and-network" }
)

const TweetsPage: NextPage = () => {
  useTweetCanceledEvent()
  useTweetUncanceledEvent()
  useTweetEditedEvent()
  useTweetPostedEvent()

  const data = usePreloadedQuery<TweetsPageQuery>(
    graphql`
      query TweetsPageQuery {
        upcoming: viewer {
          ...TweetList_tweets @arguments(filter: UPCOMING)
        }
        past: viewer {
          ...TweetList_tweets @arguments(filter: PAST)
        }
        viewer {
          ...SubscriptionProvider_user
        }
      }
    `,
    preloadedQuery
  )

  return (
    <main className="container my-8 mx-auto py-0 px-8">
      <Head title="Your Tweets" />
      {data?.viewer && (
        <SubscriptionProvider user={data.viewer}>
          <SubscribeBanner />
          {data?.upcoming && data?.past ? (
            <div className="flex flex-row flex-wrap -mx-4">
              <TweetList
                description="You have some new tweets to review."
                emptyDescription="You don't have any tweets to review."
                tweets={data.upcoming}
              />
              <TweetList
                description="Here are your already reviewed tweets."
                emptyDescription="You haven't posted or reviewed any tweets yet."
                tweets={data.past}
              />
            </div>
          ) : (
            <Loading />
          )}
        </SubscriptionProvider>
      )}
    </main>
  )
}

TweetsPage.getInitialProps = () => {
  preloadedQuery = preloadQuery(
    getEnvironment(),
    pageQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )
  return Promise.resolve({})
}

export default withSecurePage(TweetsPage)

const SubscribeBanner: React.FC = () => {
  const { isSubscribed } = useSubscription()

  if (isSubscribed) {
    return null
  }

  return (
    <Notice variant="warning" className="mb-6">
      <div className="flex items-baseline">
        <div>
          You are not currently subscribed to Courier. You cannot post tweets
          until you subscribe.
        </div>
        <Link href="/subscribe">
          <a className="ml-auto flex-shrink-0 btn btn-first bg-yellow-7 border-yellow-7 text-yellow-1">
            Subscribe now
          </a>
        </Link>
      </div>
    </Notice>
  )
}
