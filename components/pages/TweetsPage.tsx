import React from "react"
import { NextPage } from "next"
import withData from "../../hocs/withData"
import withSecurePage from "../../hocs/withSecurePage"
import { graphql } from "react-relay"
import Container from "../Container"
import Head from "../Head"
import TweetList from "../TweetList"
import Loading from "../Loading"
import SubscriptionProvider, { useSubscription } from "../SubscriptionProvider"
import Notice from "../Notice"
import PageHeader from "../PageHeader"
import PageDescription from "../PageDescription"
import { TweetsPageQueryResponse } from "../../lib/__generated__/TweetsPageQuery.graphql"

type Props = TweetsPageQueryResponse
const TweetsPage: NextPage<Props> = ({ upcoming, past, currentUser }) => {
  return (
    <Container>
      {currentUser && (
        <SubscriptionProvider user={currentUser}>
          <Head title="Your Tweets" />

          <PageHeader>Your Tweets</PageHeader>
          <PageDescription>
            These are the tweets Courier has translated from your feeds.
          </PageDescription>
          <SubscribeBanner />
          {upcoming && past ? (
            <>
              <TweetList title="Upcoming Tweet" tweets={upcoming} />
              <TweetList title="Past Tweet" tweets={past} />
            </>
          ) : (
            <Loading />
          )}
        </SubscriptionProvider>
      )}
    </Container>
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
