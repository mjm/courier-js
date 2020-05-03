import React from "react"
import { graphql } from "react-relay"
import { usePaginationFragment } from "react-relay/lib/hooks"

import Link from "next/link"

import { FeedList_feeds$key } from "@generated/FeedList_feeds.graphql"
import FeedCard from "components/FeedCard"

const FeedList: React.FC<{
  feeds: FeedList_feeds$key
}> = ({ feeds }) => {
  const { data } = usePaginationFragment(
    graphql`
      fragment FeedList_feeds on Viewer
        @refetchable(queryName: "FeedListPaginationQuery")
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
    feeds
  )

  if (!data?.allFeeds) {
    return null
  }

  const { edges } = data.allFeeds

  return (
    <div>
      {edges.length === 0 && (
        <div className="pb-4 text-neutral-10">
          You aren't watching any feeds yet.
        </div>
      )}
      <div className="-m-2">
        <div
          className={`w-full mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
          style={{ gridAutoRows: "1fr" }}
        >
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

export default FeedList
