import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { PreviewFeedContent_feed } from "@generated/PreviewFeedContent_feed.graphql"

interface Props {
  feed: PreviewFeedContent_feed
}
const PreviewFeedContent: React.FC<Props> = ({ feed }) => {
  return (
    <article className="my-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-neutral-9">{feed.title}</h3>
        <div className="text-neutral-8">
          Pulling from{" "}
          <span className="text-neutral-10 font-medium">{feed.url}</span>
        </div>
      </div>
      <div>
        {feed.tweets.map(tweet => (
          <div>{tweet.body}</div>
        ))}
      </div>
    </article>
  )
}

export default createFragmentContainer(PreviewFeedContent, {
  feed: graphql`
    fragment PreviewFeedContent_feed on FeedPreview {
      url
      title
      tweets {
        action
        body
        mediaURLs
        retweetID
      }
    }
  `,
})
