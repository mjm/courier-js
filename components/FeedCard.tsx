import React from "react"
import Moment from "react-moment"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import Link from "next/link"

import { FeedCard_feed$key } from "@generated/FeedCard_feed.graphql"

const FeedCard: React.FC<{ feed: FeedCard_feed$key }> = ({ feed }) => {
  const data = useFragment(
    graphql`
      fragment FeedCard_feed on Feed {
        id
        title
        homePageURL
        refreshedAt
        autopost
      }
    `,
    feed
  )

  return (
    <article className="bg-white rounded-lg shadow-md p-4 w-full h-full flex flex-col justify-between">
      <div className="mb-6">
        <Link href="/feeds/[id]" as={`/feeds/${data.id}`}>
          <a className="block font-bold text-neutral-9 text-lg">{data.title}</a>
        </Link>
        <a
          className="text-neutral-10 break-words"
          href={data.homePageURL}
          target="_blank"
        >
          {data.homePageURL}
        </a>
      </div>
      <div className="text-sm text-neutral-9">
        <div>
          Checked{" "}
          <span className="font-medium text-primary-10">
            <Moment fromNow>{data.refreshedAt}</Moment>
          </span>
        </div>
        <div>
          Posts{" "}
          {data.autopost ? (
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

export default FeedCard
