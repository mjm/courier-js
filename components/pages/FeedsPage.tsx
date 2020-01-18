import React from "react"

import { NextPage } from "next"
import { graphql, Environment } from "react-relay"
import Head from "components/Head"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import FeedList from "components/FeedList"
import { FeedsPageQueryResponse } from "@generated/FeedsPageQuery.graphql"

const FeedsPage: NextPage<FeedsPageQueryResponse & {
  environment: Environment
}> = ({ environment, ...props }) => {
  return (
    <main className="container mx-auto my-8">
      <Head title="Watched Feeds" />

      <FeedList feeds={props} />
    </main>
  )
}

export default withData(withSecurePage(FeedsPage), {
  query: graphql`
    query FeedsPageQuery {
      ...FeedList_feeds
    }
  `,
})
