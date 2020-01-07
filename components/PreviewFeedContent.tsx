import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { PreviewFeedContent_feed } from "@generated/PreviewFeedContent_feed.graphql"
import TweetCard from "components/TweetCard"

interface Props {
  feed: PreviewFeedContent_feed
}
const PreviewFeedContent: React.FC<Props> = ({ feed }) => {
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
    </article>
  )
}

export default createFragmentContainer(PreviewFeedContent, {
  feed: graphql`
    fragment PreviewFeedContent_feed on FeedPreview {
      url
      title
      tweets {
        ...TweetCard_tweet
      }
    }
  `,
})
