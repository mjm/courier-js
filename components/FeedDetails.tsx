import React from "react"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import { FeedDetails_feed$key } from "@generated/FeedDetails_feed.graphql"
import { FeedDetails_user$key } from "@generated/FeedDetails_user.graphql"
import { ErrorBox } from "components/ErrorBox"
import FeedInfoCard from "components/FeedInfoCard"
import FeedRecentPostList from "components/FeedRecentPostList"
import FeedRemoveButton from "components/FeedRemoveButton"
import Head from "components/Head"

const FeedDetails: React.FC<{
  feed: FeedDetails_feed$key
  user: FeedDetails_user$key
}> = ({ feed, user }) => {
  const feedData = useFragment(
    graphql`
      fragment FeedDetails_feed on Feed {
        id
        title
        url
        ...FeedRecentPostList_feed
        ...FeedInfoCard_feed
        ...FeedRemoveButton_feed
      }
    `,
    feed
  )

  const userData = useFragment(
    graphql`
      fragment FeedDetails_user on Viewer {
        ...FeedInfoCard_user
      }
    `,
    user
  )

  return (
    <div className="px-3">
      <Head title={`${feedData.title} - Feed Details`} />

      <div className="w-full flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-bold text-neutral-9">{feedData.title}</h2>
        <div className="text-sm text-neutral-8">
          Pulling from{" "}
          <span className="font-bold text-neutral-10">{feedData.url}</span>
        </div>
      </div>

      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 px-3 mb-6">
          <FeedInfoCard feed={feedData} user={userData} />
          <FeedRemoveButton feed={feedData} />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 px-3">
          <ErrorBox className="mb-4" />
          <FeedRecentPostList feed={feedData} />
        </div>
      </div>
    </div>
  )
}

export default FeedDetails
