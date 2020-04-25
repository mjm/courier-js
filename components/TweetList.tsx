import React from "react"
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
} from "react-relay"

import { TweetList_tweets } from "@generated/TweetList_tweets.graphql"
import TweetCard from "components/TweetCard"

const TweetList: React.FC<{
  description: React.ReactNode
  emptyDescription: React.ReactNode
  tweets: TweetList_tweets
  relay: RelayPaginationProp
}> = ({
  description,
  emptyDescription,
  tweets,
  relay: { hasMore, loadMore },
}) => {
  const [isLoading, setLoading] = React.useState(false)
  const { edges } = tweets.allTweets

  return (
    <div className="w-full lg:px-4 lg:w-1/2 mb-8">
      <div className="pb-4 text-neutral-10">
        {edges.length > 0 ? description : emptyDescription}
      </div>
      {edges.map(edge => (
        <TweetCard key={edge.node.id} tweet={edge.node} />
      ))}
      {hasMore() && (
        <div className="flex justify-center">
          <button
            className="btn btn-third btn-third-neutral"
            disabled={isLoading}
            onClick={() => {
              setLoading(true)
              loadMore(10, () => {
                setLoading(false)
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

export default createPaginationContainer(
  TweetList,
  {
    tweets: graphql`
      fragment TweetList_tweets on User
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
  },
  {
    direction: "forward",
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        filter: fragmentVariables.filter,
      }
    },
    getConnectionFromProps({ tweets }) {
      return tweets.allTweets
    },
    query: graphql`
      query TweetListPaginationQuery(
        $filter: TweetFilter
        $count: Int!
        $cursor: Cursor
      ) {
        viewer {
          ...TweetList_tweets
            @arguments(filter: $filter, count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
