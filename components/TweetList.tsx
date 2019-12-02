import React from "react"
import {
  graphql,
  createPaginationContainer,
  RelayPaginationProp,
} from "react-relay"
import { TweetList_tweets } from "@generated/TweetList_tweets.graphql"
import { Flex } from "@rebass/emotion"
import Group from "./Group"
import { Button } from "./Button"
import TweetCard from "./TweetCard"
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons"

interface Props {
  description: (count: number) => React.ReactNode
  emptyDescription: React.ReactNode
  tweets: TweetList_tweets
  relay: RelayPaginationProp
}

const TweetList = ({
  description,
  emptyDescription,
  tweets,
  relay: { hasMore, loadMore },
}: Props) => {
  const [isLoading, setLoading] = React.useState(false)

  const { edges, totalCount } = tweets.allTweets

  return (
    <div>
      <div
        css={theme => ({
          marginTop: theme.space[3],
          marginBottom: theme.space[3],
          color: theme.colors.neutral10,
          strong: {
            color: theme.colors.neutral9,
          },
        })}
      >
        {totalCount === 0 ? emptyDescription : description(totalCount)}
      </div>
      <Group direction="column" spacing={3}>
        {edges.map(edge => (
          <TweetCard key={edge.node.id} tweet={edge.node} />
        ))}
        {hasMore() && (
          <Flex justifyContent="center">
            <Button
              size="medium"
              icon={faAngleDoubleDown}
              spin={isLoading}
              onClick={() => {
                setLoading(true)
                loadMore(10, () => {
                  setLoading(false)
                })
              }}
            >
              Show More…
            </Button>
          </Flex>
        )}
      </Group>
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
          totalCount
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
