import React from "react"
import { NextPage } from "next"
import withData from "../hocs/relay"
import withSecurePage from "../hocs/securePage"
import { graphql } from "react-relay"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader, PageDescription } from "../components/header"
import TweetList from "../components/TweetList"
import { tweetsQueryResponse } from "../lib/__generated__/tweetsQuery.graphql"
import Loading from "../components/loading"
import SubscriptionProvider, {
  useSubscription,
} from "../components/SubscriptionProvider"
import Notice from "../components/notice"

type Props = tweetsQueryResponse
const Tweets: NextPage<Props> = ({ upcoming, past, currentUser }) => {
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

export default withData(withSecurePage(Tweets), {
  query: graphql`
    query tweetsQuery {
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
