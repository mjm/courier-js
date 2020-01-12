import React from "react"
import { NextPage } from "next"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { graphql } from "react-relay"
import Head from "components/Head"
import TweetList from "components/TweetList"
import Loading from "components/Loading"
import SubscriptionProvider, {
  useSubscription,
} from "components/SubscriptionProvider"
import Notice from "components/Notice"
import { TweetsPageQueryResponse } from "@generated/TweetsPageQuery.graphql"

type Props = TweetsPageQueryResponse
const TweetsPage: NextPage<Props> = ({ upcoming, past, currentUser }) => {
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
      currentUser {
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

const SubscribeBanner = () => {
  const { isSubscribed } = useSubscription()

  if (isSubscribed) {
    return null
  }

  return (
    <Notice variant="warning">
      You are not currently subscribed to Courier. You cannot post tweets until
      you subscribe.
    </Notice>
  )
}
