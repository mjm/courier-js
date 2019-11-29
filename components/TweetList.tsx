import React from "react"
import {
  graphql,
  createPaginationContainer,
  RelayPaginationProp,
} from "react-relay"
import { TweetList_tweets } from "../lib/__generated__/TweetList_tweets.graphql"
import { SectionHeader } from "./header"
import { FlushContainer } from "./container"
import Card from "./card"
import { Text, Flex } from "@rebass/emotion"
import Group from "./group"
import { Button } from "./button"
import TweetCard from "./TweetCard"
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons"

interface Props {
  title: string
  tweets: TweetList_tweets
  relay: RelayPaginationProp
}

const TweetList = ({ title, tweets, relay: { hasMore, loadMore } }: Props) => {
  const [isLoading, setLoading] = React.useState(false)

  const { edges, totalCount } = tweets.allTweets
  if (!edges.length) {
    return (
      <div>
        <SectionHeader>{title}s</SectionHeader>
        <FlushContainer>
          <Card mb={4}>
            <Text textAlign="center">
              You don't have any {title.toLowerCase()}s.
            </Text>
          </Card>
        </FlushContainer>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader>
        {totalCount} {title}
        {totalCount === 1 ? "" : "s"}
      </SectionHeader>
      <FlushContainer mb={4}>
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
      </FlushContainer>
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
