import React from "react"
import { graphql } from "react-relay"
import { preloadQuery, usePreloadedQuery } from "react-relay/hooks"

import { NextPage } from "next"

import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"
import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import pageQuery, { FeedsPageQuery } from "@generated/FeedsPageQuery.graphql"
import FeedList from "components/FeedList"
import Head from "components/Head"
import { getEnvironment } from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

let preloadedQuery = preloadQuery<FeedsPageQuery>(
  getEnvironment(),
  pageQuery,
  {},
  { fetchPolicy: "store-and-network" }
)

const FeedsPage: NextPage = () => {
  useFeedRefreshedEvent()
  useFeedOptionsChangedEvent()

  const data = usePreloadedQuery(
    graphql`
      query FeedsPageQuery {
        viewer {
          ...FeedList_feeds
        }
      }
    `,
    preloadedQuery
  )

  return (
    <main className="container mx-auto my-8">
      <Head title="Watched Feeds" />

      {data?.viewer && <FeedList feeds={data.viewer} />}
    </main>
  )
}

FeedsPage.getInitialProps = () => {
  preloadedQuery = preloadQuery(
    getEnvironment(),
    pageQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )
  return Promise.resolve({})
}

export default withSecurePage(FeedsPage)
