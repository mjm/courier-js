import React from "react"

import { NextPage } from "next"
import { graphql, Environment } from "react-relay"
import Container from "../components/Container"
import Head from "../components/Head"
import withData from "../hocs/relay"
import withSecurePage from "../hocs/securePage"
import { feedsQueryResponse } from "../lib/__generated__/feedsQuery.graphql"
import FeedList from "../components/FeedList"
import AddFeedForm from "../components/AddFeedForm"
import PageHeader from "../components/PageHeader"
import PageDescription from "../components/PageDescription"

type Props = feedsQueryResponse & {
  environment: Environment
}
const Feeds: NextPage<Props> = ({ environment, ...props }) => {
  return (
    <Container>
      <Head title="Feeds to Watch" />

      <PageHeader>Feeds to Watch</PageHeader>
      <PageDescription>
        The feeds you add here will be checked for new posts that need to be
        tweeted.
      </PageDescription>
      <FeedList feeds={props} />
      <AddFeedForm environment={environment} />
    </Container>
  )
}

export default withData(withSecurePage(Feeds), {
  query: graphql`
    query feedsQuery {
      ...FeedList_feeds
    }
  `,
})
