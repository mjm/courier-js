import React from "react"
import { graphql } from "react-relay"
import { usePreloadedQuery } from "react-relay/hooks"

import { NextPage } from "next"

import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"
import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import { FeedsPageQuery } from "@generated/FeedsPageQuery.graphql"
import FeedList from "components/FeedList"
import Head from "components/Head"
import withSecurePage from "hocs/withSecurePage"
import { preloader } from "utils/preloader"

const FeedsPage: NextPage = () => {
  useFeedRefreshedEvent()
  useFeedOptionsChangedEvent()

  const data = usePreloadedQuery<FeedsPageQuery>(
    graphql`
      query FeedsPageQuery {
        viewer {
          ...FeedList_feeds
        }
      }
    `,
    preloader.get("/feeds")
  )

  return (
    <main className="container mx-auto my-8">
      <Head title="Watched Feeds" />

      {data?.viewer && <FeedList feeds={data.viewer} />}
    </main>
  )
}

export default withSecurePage(FeedsPage)
