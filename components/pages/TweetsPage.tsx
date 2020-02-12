import React from "react"
import { graphql } from "react-relay"

import { NextPage } from "next"
import Link from "next/link"

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

const TweetsPage: NextPage<TweetsPageQueryResponse> = ({
  upcoming,
  past,
  currentUser,
}) => {
  return (
    <main className="container my-8 mx-auto py-0 px-8">
      <Head title="Your Tweets" />
      {currentUser && (
        <SubscriptionProvider user={currentUser}>
          <SubscribeBanner />
          {upcoming && past ? (
            <div className="flex flex-row flex-wrap -mx-4">
              <TweetList
                emptyDescription="You don't have anymore tweets to review."
                description={upcomingDescription}
                tweets={upcoming}
              />
              <TweetList
                emptyDescription="You haven't posted any tweets from Courier yet."
                description={pastDescription}
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

const upcomingDescription = (count: number): React.ReactNode => {
  return (
    <>
      There{" "}
      {count === 1 ? (
        <>
          is <strong className="text-neutral-9">1 draft tweet</strong>
        </>
      ) : (
        <>
          are <strong className="text-neutral-9">{count} draft tweets</strong>
        </>
      )}{" "}
      awaiting your review.
    </>
  )
}

const pastDescription = (count: number): React.ReactNode => {
  return (
    <>
      You have{" "}
      <strong className="text-neutral-9">
        {count} past tweet{count === 1 ? "" : "s"}
      </strong>{" "}
      that you've already reviewed.
    </>
  )
}

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
