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

type Props = tweetsQueryResponse
const Tweets: NextPage<Props> = ({ upcoming, past }) => {
  return (
    <Container>
      <Head title="Your Tweets" />

      <PageHeader>Your Tweets</PageHeader>
      <PageDescription>
        These are the tweets Courier has translated from your feeds.
      </PageDescription>
      {/* <SubscribeBanner /> */}
      {upcoming && past ? (
        <>
          <TweetList title="Upcoming Tweet" tweets={upcoming} />
          <TweetList title="Past Tweet" tweets={past} />
        </>
      ) : (
        <Loading />
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
    }
  `,
})

// const SubscribeBanner = () => {
//   const { isSubscribed } = useSubscription()

//   if (isSubscribed) {
//     return null
//   }

//   return (
//     <Notice variant="warning">
//       You are not currently subscribed to Courier. You cannot post tweets until
//       you subscribe.
//     </Notice>
//   )
// }
