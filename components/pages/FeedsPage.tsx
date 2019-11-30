import React from "react"

import { NextPage } from "next"
import { graphql, Environment } from "react-relay"
import Container from "../Container"
import Head from "../Head"
import withData from "../../hocs/relay"
import withSecurePage from "../../hocs/securePage"
import FeedList from "../FeedList"
import AddFeedForm from "../AddFeedForm"
import PageHeader from "../PageHeader"
import PageDescription from "../PageDescription"
import { FeedsPageQueryResponse } from "../../lib/__generated__/FeedsPageQuery.graphql"

type Props = FeedsPageQueryResponse & {
  environment: Environment
}
const FeedsPage: NextPage<Props> = ({ environment, ...props }) => {
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

export default withData(withSecurePage(FeedsPage), {
  query: graphql`
    query FeedsPageQuery {
      ...FeedList_feeds
    }
  `,
})
