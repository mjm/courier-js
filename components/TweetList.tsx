import React from "react"
import { graphql } from "react-relay"
import { usePaginationFragment } from "react-relay/lib/hooks"

import { TweetList_tweets$key } from "@generated/TweetList_tweets.graphql"
import { TweetListPaginationQuery } from "@generated/TweetListPaginationQuery.graphql"
import TweetCard from "components/TweetCard"

const TweetList: React.FC<{
  description: React.ReactNode
  emptyDescription: React.ReactNode
  tweets: TweetList_tweets$key
}> = ({ description, emptyDescription, tweets }) => {
  const { data, loadNext, hasNext } = usePaginationFragment<
    TweetListPaginationQuery,
    TweetList_tweets$key
  >(
    graphql`
      fragment TweetList_tweets on Viewer
        @refetchable(queryName: "TweetListPaginationQuery")
        @argumentDefinitions(
          filter: { type: "TweetFilter" }
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        allTweets(filter: $filter, first: $count, after: $cursor)
          @connection(key: "TweetList_allTweets") {
          edges {
            node {
              id
              ...TweetCard_tweet
            }
          }
        }
      }
    `,
    tweets
  )
  const [isLoading, setLoading] = React.useState(false)
  const { edges } = data.allTweets

  return (
    <div className="w-full lg:px-4 lg:w-1/2 mb-8">
      <div className="pb-4 text-neutral-10">
        {edges.length > 0 ? description : emptyDescription}
      </div>
      {edges.map(edge => (
        <TweetCard key={edge.node.id} tweet={edge.node} />
      ))}
      {hasNext && (
        <div className="flex justify-center">
          <button
            className="btn btn-third btn-third-neutral"
            disabled={isLoading}
            onClick={() => {
              setLoading(true)
              loadNext(10, {
                onComplete() {
                  setLoading(false)
                },
              })
            }}
          >
            Show more…
          </button>
        </div>
      )}
    </div>
  )
}

export default TweetList
