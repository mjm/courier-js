import React from "react"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import { PreviewFeedContent_feed$key } from "@generated/PreviewFeedContent_feed.graphql"
import AsyncButton from "components/AsyncButton"
import TweetCard from "components/TweetCard"

const PreviewFeedContent: React.FC<{
  feed: PreviewFeedContent_feed$key
  onWatch: () => Promise<void>
}> = props => {
  const feed = useFragment(
    graphql`
      fragment PreviewFeedContent_feed on FeedPreview {
        url
        title
        tweets {
          ...TweetCard_tweet
        }
      }
    `,
    props.feed
  )

  return (
    <article className="my-8">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-neutral-9">{feed.title}</h3>
        <div className="text-neutral-8">
          Pulling from{" "}
          <span className="text-neutral-10 font-medium">{feed.url}</span>
        </div>
      </div>
      <div>
        <div className="mb-6 text-neutral-10">
          Here are the 5 most recent posts translated into tweets:
        </div>
        {feed.tweets.map((tweet, index) => (
          <div key={index} className="mb-3">
            <TweetCard tweet={tweet} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <AsyncButton
          type="button"
          className="btn btn-first btn-first-secondary"
          onClick={async () => await props.onWatch()}
        >
          Watch feed
        </AsyncButton>
      </div>
    </article>
  )
}

export default PreviewFeedContent
