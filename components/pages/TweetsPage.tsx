import React from "react"
import { NextPage } from "next"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { graphql } from "react-relay"
import Head from "components/Head"
import TweetList from "components/TweetList"
import SubscriptionProvider, {
  useSubscription,
} from "components/SubscriptionProvider"
import Notice from "components/Notice"
import { TweetsPageQueryResponse } from "@generated/TweetsPageQuery.graphql"
import styled from "@emotion/styled"

type Props = TweetsPageQueryResponse
const TweetsPage: NextPage<Props> = ({ upcoming, past, currentUser }) => {
  return (
    <PageContainer>
      <Head title="Your Tweets" />
      {currentUser && (
        <SubscriptionProvider user={currentUser}>
          <SubscribeBanner />
          {upcoming && past ? (
            <ColumnsContainer>
              <TweetList
                emptyDescription={<>You don't have anymore tweets to review.</>}
                description={count => (
                  <>
                    There{" "}
                    {count === 1 ? (
                      <>
                        is <strong>1 draft tweet</strong>
                      </>
                    ) : (
                      <>
                        are <strong>{count} draft tweets</strong>
                      </>
                    )}{" "}
                    awaiting your review.
                  </>
                )}
                tweets={upcoming}
              />
              <ColumnSpacer />
              <TweetList
                emptyDescription={
                  <>You haven't posted any tweets from Courier yet.</>
                }
                description={count => (
                  <>
                    You have{" "}
                    <strong>
                      {count} past tweet{count === 1 ? "" : "s"}
                    </strong>{" "}
                    that you've already reviewed.
                  </>
                )}
                tweets={past}
              />
            </ColumnsContainer>
          ) : null}
        </SubscriptionProvider>
      )}
    </PageContainer>
  )
}

export default withData(withSecurePage(TweetsPage), {
  query: graphql`
    query TweetsPageQuery {
      upcoming: viewer {
        ...TweetList_tweets @arguments(filter: UPCOMING)
      }
      past: viewer {
        ...TweetList_tweets @arguments(filter: PAST)
      }
      currentUser {
        ...SubscriptionProvider_user
      }
    }
  `,
})

const PageContainer = styled.main(({ theme }) => ({
  margin: "0 auto",
  padding: `0 ${theme.space[3]}`,
}))

const ColumnsContainer = styled.div(({ theme }) => ({
  margin: `${theme.space[4]} auto`,
  maxWidth: 500,
  display: "flex",
  flexDirection: "column",
  [`@media (min-width: 864px)`]: {
    flexDirection: "row",
    maxWidth: 1064,
  },
}))

const ColumnSpacer = styled.div({ width: 64 })

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
