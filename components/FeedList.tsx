import React from "react"

import { createPaginationContainer, graphql } from "react-relay"
import { FeedList_feeds } from "@generated/FeedList_feeds.graphql"
import FeedCard from "components/FeedCard"

interface Props {
  feeds: FeedList_feeds
}

const FeedList: React.FC<Props> = ({ feeds }) => {
  const { edges, totalCount } = feeds.allSubscribedFeeds

  return (
    <div>
      <div className="pb-4 pt-8 text-neutral-10">
        {totalCount === 0 ? (
          "You aren't watching any feeds yet."
        ) : totalCount === 1 ? (
          <>
            You are currently watching{" "}
            <strong className="text-neutral-9">1 feed</strong> for new posts.
          </>
        ) : (
          <>
            You are currently watching{" "}
            <strong className="text-neutral-10">{totalCount} feeds</strong> for
            new posts.
          </>
        )}
      </div>
      <div className="-m-2">
        <div className="flex flex-row flex-wrap w-full mb-4">
          {edges.map(({ node }) => (
            <div
              key={node.id}
              className="p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <FeedCard feed={node} />
            </div>
          ))}
          <div className="p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <button className="bg-neutral-3 rounded-lg shadow-md p-4 w-full h-full flex justify-center items-center">
              <div className="m-auto font-medium text-neutral-9">
                Watch a new feed…
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
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
          totalCount
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
