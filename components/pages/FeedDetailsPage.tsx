import React from "react"
import { graphql } from "react-relay"
import { preloadQuery, usePreloadedQuery } from "react-relay/hooks"
import { PreloadedQuery } from "react-relay/lib/relay-experimental/EntryPointTypes"

import { NextPage } from "next"

import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"
import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import pageQuery, {
  FeedDetailsPageQuery,
} from "@generated/FeedDetailsPageQuery.graphql"
import { ErrorContainer } from "components/ErrorContainer"
import FeedDetails from "components/FeedDetails"
import { getEnvironment } from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

let preloadedQuery: PreloadedQuery<FeedDetailsPageQuery> | null = null

function preload(id: string): void {
  preloadedQuery = preloadQuery(
    getEnvironment(),
    pageQuery,
    { id },
    { fetchPolicy: "store-and-network" }
  )
}

const FeedDetailsPage: NextPage<{ id: string }> = ({ id }) => {
  useFeedRefreshedEvent()
  useFeedOptionsChangedEvent()

  if (preloadedQuery) {
    return <FeedDetailsPageInner query={preloadedQuery} />
  } else {
    preload(id)
    return null
  }
}

FeedDetailsPage.getInitialProps = ({ query }) => {
  preload(query.id as string)
  return { id: query.id as string }
}

export default withSecurePage(FeedDetailsPage)

const FeedDetailsPageInner: React.FC<{
  query: PreloadedQuery<FeedDetailsPageQuery>
}> = ({ query }) => {
  const data = usePreloadedQuery(
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
    query
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
