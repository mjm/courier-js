import React from "react"
import { Environment, graphql } from "react-relay"

import { NextPage } from "next"
import Link from "next/link"

import { useTweetCanceledEvent } from "@events/TweetCanceledEvent"
import { useTweetPostedEvent } from "@events/TweetPostedEvent"
import { useTweetUncanceledEvent } from "@events/TweetUncanceledEvent"
import { TweetsPageQueryResponse } from "@generated/TweetsPageQuery.graphql"
import Head from "components/Head"
import Loading from "components/Loading"
import Notice from "components/Notice"
import SubscriptionProvider, {
  useSubscription,
} from "components/SubscriptionProvider"
import TweetList from "components/TweetList"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { useTweetEditedEvent } from "@events/TweetEditedEvent"

const TweetsPage: NextPage<TweetsPageQueryResponse & {
  environment: Environment
}> = ({ upcoming, past, viewer, environment }) => {
  useTweetCanceledEvent(environment)
  useTweetUncanceledEvent(environment)
  useTweetEditedEvent(environment)
  useTweetPostedEvent(environment)

  return (
    <main className="container my-8 mx-auto py-0 px-8">
      <Head title="Your Tweets" />
      {viewer && (
        <SubscriptionProvider user={viewer}>
          <SubscribeBanner />
          {upcoming && past ? (
            <div className="flex flex-row flex-wrap -mx-4">
              <TweetList
                description="You have some new tweets to review."
                emptyDescription="You don't have any tweets to review."
                tweets={upcoming}
              />
              <TweetList
                description="Here are your already reviewed tweets."
                emptyDescription="You haven't posted or reviewed any tweets yet."
                tweets={past}
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

export default withData(withSecurePage(TweetsPage), {
  query: graphql`
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
})

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
