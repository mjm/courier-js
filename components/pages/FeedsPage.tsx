import React from "react"
import { Environment, graphql } from "react-relay"

import { NextPage } from "next"

import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import { FeedsPageQueryResponse } from "@generated/FeedsPageQuery.graphql"
import FeedList from "components/FeedList"
import Head from "components/Head"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"

const FeedsPage: NextPage<FeedsPageQueryResponse & {
  environment: Environment
}> = ({ environment, ...props }) => {
  useFeedRefreshedEvent(environment)
  useFeedOptionsChangedEvent(environment)

  if (!props.viewer) {
    return null
  }

  return (
    <main className="container mx-auto my-8">
      <Head title="Watched Feeds" />

      <FeedList feeds={props.viewer} />
    </main>
  )
}

export default withData(withSecurePage(FeedsPage), {
  query: graphql`
    query FeedsPageQuery {
      viewer {
        ...FeedList_feeds
      }
    }
  `,
})
