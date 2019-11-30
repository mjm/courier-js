import React from "react"

import { createPaginationContainer, graphql } from "react-relay"
import { FeedList_feeds } from "../lib/__generated__/FeedList_feeds.graphql"
import { FlushContainer } from "./Container"
import Group from "./group"
import FeedCard from "./FeedCard"

interface Props {
  feeds: FeedList_feeds
}

const FeedList: React.FC<Props> = ({ feeds }) => {
  return (
    <FlushContainer>
      <Group direction="column" spacing={3} mb={3}>
        {feeds.allSubscribedFeeds.edges.map(({ node }) => (
          <FeedCard key={node.id} feed={node} />
        ))}
      </Group>
    </FlushContainer>
  )
}

export default createPaginationContainer(
  FeedList,
  {
    feeds: graphql`
      fragment FeedList_feeds on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        allSubscribedFeeds(first: $count, after: $cursor)
          @connection(key: "FeedList_allSubscribedFeeds") {
          edges {
            node {
              id
              ...FeedCard_feed
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, _fragmentVariables) {
      return {
        count,
        cursor,
      }
    },
    query: graphql`
      query FeedListPaginationQuery($count: Int!, $cursor: Cursor) {
        ...FeedList_feeds @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)
