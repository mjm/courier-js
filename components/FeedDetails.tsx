import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FeedDetails_feed } from "@generated/FeedDetails_feed.graphql"
import Head from "components/Head"
import { ErrorBox } from "components/ErrorBox"
import { FeedDetails_user } from "@generated/FeedDetails_user.graphql"
import FeedInfoCard from "components/FeedInfoCard"
import FeedRecentPostList from "components/FeedRecentPostList"

interface Props {
  feed: FeedDetails_feed
  user: FeedDetails_user
}

const FeedDetails: React.FC<Props> = ({ feed, user }) => {
  return (
    <>
      <Head title={`${feed.feed.title} - Feed Details`} />

      <div className="w-full flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-bold text-neutral-9">{feed.feed.title}</h2>
        <div className="text-sm text-neutral-8">
          Pulling from{" "}
          <span className="font-bold text-neutral-10">{feed.feed.url}</span>
        </div>
      </div>

      <div className="w-full flex">
        <div className="w-64 flex-shrink-0 mr-6">
          <FeedInfoCard feed={feed} user={user} />
        </div>
        <div className="flex-grow">
          <ErrorBox className="mb-4" />
          <FeedRecentPostList feed={feed.feed} />
        </div>
      </div>
    </>
  )
}

export default createFragmentContainer(FeedDetails, {
  feed: graphql`
    fragment FeedDetails_feed on SubscribedFeed {
      id
      feed {
        title
        url
        ...FeedRecentPostList_feed
      }
      ...FeedInfoCard_feed
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
