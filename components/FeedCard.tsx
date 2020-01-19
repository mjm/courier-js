import React from "react"
import Moment from "react-moment"
import { createFragmentContainer, graphql } from "react-relay"

import Link from "next/link"

import { FeedCard_feed } from "@generated/FeedCard_feed.graphql"

interface Props {
  feed: FeedCard_feed
}
const FeedCard: React.FC<Props> = ({ feed }) => {
  return (
    <article className="bg-white rounded-lg shadow-md p-4 w-full h-full">
      <div className="mb-6">
        <Link href="/feeds/[id]" as={`/feeds/${feed.id}`}>
          <a className="block font-bold text-neutral-9 text-lg">
            {feed.feed.title}
          </a>
        </Link>
        <a
          className="text-neutral-10 break-words"
          href={feed.feed.homePageURL}
          target="_blank"
        >
          {feed.feed.homePageURL}
        </a>
      </div>
      <div className="text-sm text-neutral-9">
        <div>
          Checked{" "}
          <span className="font-medium text-primary-10">
            <Moment fromNow>{feed.feed.refreshedAt}</Moment>
          </span>
        </div>
        <div>
          Posts{" "}
          {feed.autopost ? (
            <>
              automatically after{" "}
              <span className="font-medium text-primary-10">5 minutes</span>
            </>
          ) : (
            <span className="font-medium text-primary-10">manually</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default createFragmentContainer(FeedCard, {
  feed: graphql`
    fragment FeedCard_feed on SubscribedFeed {
      id
      feed {
        id
        url
        title
        homePageURL
        micropubEndpoint
        refreshedAt
      }
      autopost
    }
  `,
})
