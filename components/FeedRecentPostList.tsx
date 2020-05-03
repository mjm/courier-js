import React from "react"
import Moment from "react-moment"
import { graphql } from "react-relay"
import { useRefetchableFragment } from "react-relay/hooks"

import striptags from "striptags"

import { FeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import { FeedRecentPostList_feed$key } from "@generated/FeedRecentPostList_feed.graphql"
import { FeedRecentPostRefetchQuery } from "@generated/FeedRecentPostRefetchQuery.graphql"
import { useEvent } from "components/EventsProvider"

const FeedRecentPostList: React.FC<{
  feed: FeedRecentPostList_feed$key
}> = ({ feed }) => {
  const [data, refetch] = useRefetchableFragment<
    FeedRecentPostRefetchQuery,
    FeedRecentPostList_feed$key
  >(
    graphql`
      fragment FeedRecentPostList_feed on Feed
        @refetchable(queryName: "FeedRecentPostRefetchQuery")
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        id
        posts(first: $count, after: $cursor)
          @connection(key: "FeedRecentPostList_posts") {
          edges {
            node {
              id
              url
              title
              htmlContent
              publishedAt
            }
          }
        }
      }
    `,
    feed
  )

  useEvent(
    "FeedRefreshed",
    (evt: FeedRefreshedEvent) => {
      if (data?.id && evt.feed_id === data?.id) {
        refetch({ id: data.id }, { fetchPolicy: "network-only" })
      }
    },
    [data?.id]
  )

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      {data &&
        data.posts.edges.map(({ node }) => (
          <a
            key={node.id}
            className={`p-4 flex items-baseline justify-stretch border-neutral-2 border-t first:border-0 group hover:bg-primary-1`}
            href={node.url}
            target="_blank"
          >
            <div className="flex-grow truncate text-neutral-10 group-hover:text-primary-10">
              {node.title ? (
                <span className="font-medium">{node.title}</span>
              ) : (
                striptags(node.htmlContent)
              )}
            </div>
            <div className="flex-shrink-0 ml-4 text-sm text-neutral-8 group-hover:text-primary-9">
              <Moment fromNow>{node.publishedAt}</Moment>
            </div>
          </a>
        ))}
    </div>
  )
}

export default FeedRecentPostList
