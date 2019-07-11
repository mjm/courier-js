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
import { Flex } from "@rebass/emotion"

const Tweets = ({ user }: any) => (
  <Container>
    <Head title="Your Tweets" />

    <PageHeader>Your Tweets</PageHeader>
    <PageDescription>
      These are the tweets Courier has translated from your feeds.
    </PageDescription>
    <TweetsList
      title="Upcoming Tweet"
      query={UpcomingTweetsComponent}
      user={user}
    />
    <TweetsList title="Past Tweet" query={PastTweetsComponent} user={user} />
  </Container>
)

export default withData(withSecurePage(Tweets))

interface TweetsListProps {
  // this type should match both upcoming and past.
  // we just had to pick one to use to grab the type
  query: typeof UpcomingTweetsComponent

  title: string
  user: any
}
const TweetsList = ({
  query: QueryComponent,
  title,
  user,
}: TweetsListProps) => {
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
            return null
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
                    <TweetCard key={tweet.id} tweet={tweet} user={user} />
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
  user: any
}

const TweetCard = ({ tweet, user }: TweetCardProps) => {
  const [editing, setEditing] = useState(false)

  const appearance =
    tweet.status === TweetStatus.Canceled ? "canceled" : "normal"

  return (
    <Card variant={appearance}>
      {editing ? (
        <EditTweet tweet={tweet} onStopEditing={() => setEditing(false)} />
      ) : (
        <ViewTweet tweet={tweet} user={user} onEdit={() => setEditing(true)} />
      )}
    </Card>
  )
}
