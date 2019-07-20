import React, { useState } from "react"
import Head from "../components/head"
import {
  PageHeader,
  PageDescription,
  SectionHeader,
} from "../components/header"
import {
  UpcomingTweetsComponent,
  PastTweetsComponent,
  AllTweetsFieldsFragment,
  TweetStatus,
} from "../lib/generated/graphql-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Container, { FlushContainer } from "../components/container"
import ViewTweet from "../components/tweet/view"
import EditTweet from "../components/tweet/edit"
import { Button } from "../components/button"
import Card from "../components/card"
import Group from "../components/group"
import { Flex, Text } from "@rebass/emotion"
import { NextPage } from "next"
import { useSubscription } from "../hooks/subscription"
import Notice from "../components/notice"

const Tweets: NextPage<{}> = () => (
  <Container>
    <Head title="Your Tweets" />

    <PageHeader>Your Tweets</PageHeader>
    <PageDescription>
      These are the tweets Courier has translated from your feeds.
    </PageDescription>
    <SubscribeBanner />
    <TweetsList title="Upcoming Tweet" query={UpcomingTweetsComponent} />
    <TweetsList title="Past Tweet" query={PastTweetsComponent} />
  </Container>
)

export default withData(withSecurePage(Tweets))

interface TweetsListProps {
  // this type should match both upcoming and past.
  // we just had to pick one to use to grab the type
  query: typeof UpcomingTweetsComponent

  title: string
}
const TweetsList = ({ query: QueryComponent, title }: TweetsListProps) => {
  const [isLoadingMore, setLoadingMore] = useState(false)

  return (
    <div>
      <QueryComponent fetchPolicy="cache-and-network">
        {({ data, error, loading, fetchMore }) => {
          if (loading && !(data && data.allTweets)) {
            return (
              <>
                <SectionHeader>{title}s</SectionHeader>
                <Loading />
              </>
            )
          }

          if (error) {
            return (
              <>
                <SectionHeader>{title}s</SectionHeader>
                <ErrorBox error={error} />
              </>
            )
          }

          if (!data) {
            return null
          }

          const { nodes, pageInfo, totalCount } = data.allTweets
          if (!nodes.length) {
            return (
              <>
                <SectionHeader>{title}s</SectionHeader>
                <FlushContainer>
                  <Card mb={4}>
                    <Text textAlign="center">
                      You don't have any {title.toLowerCase()}s.
                    </Text>
                  </Card>
                </FlushContainer>
              </>
            )
          }

          const loadMore = async () => {
            setLoadingMore(true)
            try {
              await fetchMore({
                variables: {
                  cursor: pageInfo.endCursor,
                },
                updateQuery(previousResult, { fetchMoreResult }) {
                  if (!fetchMoreResult) {
                    return previousResult
                  }
                  const oldNodes = previousResult.allTweets.nodes
                  const {
                    nodes: newNodes,
                    pageInfo,
                    totalCount,
                  } = fetchMoreResult.allTweets

                  return {
                    allTweets: {
                      __typename: "TweetConnection",
                      nodes: [...oldNodes, ...newNodes],
                      pageInfo,
                      totalCount,
                    },
                  }
                },
              })
            } catch (err) {
              console.error(err)
            } finally {
              setLoadingMore(false)
            }
          }

          return (
            <>
              <SectionHeader>
                {totalCount} {title}
                {totalCount === 1 ? "" : "s"}
              </SectionHeader>
              <FlushContainer mb={4}>
                <Group direction="column" spacing={3}>
                  {nodes.map(tweet => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                  ))}
                  {pageInfo.hasPreviousPage && (
                    <Flex justifyContent="center">
                      <Button
                        size="medium"
                        icon={faAngleDoubleDown}
                        spin={isLoadingMore}
                        onClick={loadMore}
                      >
                        Show More…
                      </Button>
                    </Flex>
                  )}
                </Group>
              </FlushContainer>
            </>
          )
        }}
      </QueryComponent>
    </div>
  )
}

interface TweetCardProps {
  tweet: AllTweetsFieldsFragment
}

const TweetCard = ({ tweet }: TweetCardProps) => {
  const [editing, setEditing] = useState(false)

  const appearance =
    tweet.status === TweetStatus.Canceled ? "canceled" : "normal"

  return (
    <Card variant={appearance}>
      {editing ? (
        <EditTweet tweet={tweet} onStopEditing={() => setEditing(false)} />
      ) : (
        <ViewTweet tweet={tweet} onEdit={() => setEditing(true)} />
      )}
    </Card>
  )
}

const SubscribeBanner = () => {
  const { isSubscribed } = useSubscription()

  if (isSubscribed) {
    return null
  }

  return (
    <Notice variant="warning">
      You are not currently subscribed to Courier. You cannot post tweets until
      you subscribe.
    </Notice>
  )
}
