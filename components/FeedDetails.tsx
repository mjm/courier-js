import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FeedDetails_feed } from "../lib/__generated__/FeedDetails_feed.graphql"
import Head from "./head"
import { PageHeader } from "./header"
import { FlushContainer } from "./Container"
import Group from "./group"
import { ErrorBox } from "./ErrorBox"
import { FeedDetails_user } from "../lib/__generated__/FeedDetails_user.graphql"
import FeedInfoCard from "./FeedInfoCard"
import FeedRecentPostList from "./FeedRecentPostList"
import FeedAutopostCard from "./FeedAutopostCard"
import FeedRemoveCard from "./FeedRemoveCard"

interface Props {
  feed: FeedDetails_feed
  user: FeedDetails_user
}

const FeedDetails: React.FC<Props> = ({ feed, user }) => {
  return (
    <>
      <Head title={`${feed.feed.title} - Feed Details`} />

      <PageHeader mb={4}>{feed.feed.title}</PageHeader>
      <FlushContainer>
        <Group direction="column" spacing={3}>
          <ErrorBox width={undefined} />
          <FeedInfoCard feed={feed.feed} user={user} />
          <FeedRecentPostList feed={feed.feed} />
          <FeedAutopostCard feed={feed} />
          <FeedRemoveCard feed={feed} />
        </Group>
      </FlushContainer>
    </>
  )
}

export default createFragmentContainer(FeedDetails, {
  feed: graphql`
    fragment FeedDetails_feed on SubscribedFeed {
      id
      feed {
        title
        ...FeedInfoCard_feed
        ...FeedRecentPostList_feed
      }
      ...FeedAutopostCard_feed
      ...FeedRemoveCard_feed
    }
  `,
  user: graphql`
    fragment FeedDetails_user on User {
      ...FeedInfoCard_user
    }
  `,
})
