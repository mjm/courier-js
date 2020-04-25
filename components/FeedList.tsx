import React from "react"
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
} from "react-relay"

import Link from "next/link"

import { FeedList_feeds } from "@generated/FeedList_feeds.graphql"
import FeedCard from "components/FeedCard"

// need to use CSS Grid _and_ media queries, so a CSS module is the best thing here
import styles from "components/FeedList.module.css"

const FeedList: React.FC<{
  feeds: FeedList_feeds
  relay: RelayPaginationProp
}> = ({ feeds }) => {
  if (!feeds.allFeeds) {
    return null
  }

  const { edges } = feeds.allFeeds

  return (
    <div>
      {edges.length === 0 && (
        <div className="pb-4 text-neutral-10">
          You aren't watching any feeds yet.
        </div>
      )}
      <div className="-m-2">
        <div className={`w-full mb-4 ${styles.feedGrid}`}>
          {edges.map(({ node }) => (
            <div key={node.id} className="p-2">
              <FeedCard feed={node} />
            </div>
          ))}
          <div className="p-2">
            <Link href="/feeds/new">
              <a className="bg-neutral-3 rounded-lg shadow-md p-4 w-full h-full flex justify-center items-center">
                <div className="m-auto font-medium text-neutral-9">
                  Watch a new feed…
                </div>
              </a>
            </Link>
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
      fragment FeedList_feeds on User
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        allFeeds(first: $count, after: $cursor)
          @connection(key: "FeedList_allFeeds") {
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
        viewer {
          ...FeedList_feeds @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
