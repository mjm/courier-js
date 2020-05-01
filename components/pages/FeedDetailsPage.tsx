import React from "react"
import { graphql } from "react-relay"
import { usePreloadedQuery } from "react-relay/hooks"

import { NextPage } from "next"

import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"
import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import { FeedDetailsPageQuery } from "@generated/FeedDetailsPageQuery.graphql"
import { ErrorContainer } from "components/ErrorContainer"
import FeedDetails from "components/FeedDetails"
import withSecurePage from "hocs/withSecurePage"
import { preloader } from "utils/preloader"
import { useRouter } from "next/router"

const FeedDetailsPage: NextPage = () => {
  const router = useRouter()
  useFeedRefreshedEvent()
  useFeedOptionsChangedEvent()

  const data = usePreloadedQuery<FeedDetailsPageQuery>(
    graphql`
      query FeedDetailsPageQuery($id: ID!) {
        feed(id: $id) {
          ...FeedDetails_feed
        }
        viewer {
          ...FeedDetails_user
        }
      }
    `,
    preloader.get(router.asPath)
  )

  if (!data?.viewer || !data?.feed) {
    return null
  }

  return (
    <main className="container mx-auto my-8">
      <ErrorContainer>
        <FeedDetails feed={data.feed} user={data.viewer} />
      </ErrorContainer>
    </main>
  )
}

export default withSecurePage(FeedDetailsPage)
