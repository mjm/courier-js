import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import Linkify from "linkifyjs/react"

import { ViewTweet_tweet } from "@generated/ViewTweet_tweet.graphql"

mention(linkify)

const ViewTweet: React.FC<{
  tweet: ViewTweet_tweet
  linkClassName?: string
}> = ({ tweet, linkClassName = "" }) => {
  return (
    <>
      <TweetBody linkClassName={linkClassName} tweet={tweet} />
      <TweetMedia tweet={tweet} />
    </>
  )
}

export default createFragmentContainer(ViewTweet, {
  tweet: graphql`
    fragment ViewTweet_tweet on Tweet {
      body
      mediaURLs
    }
  `,
})

const TweetBody: React.FC<{
  linkClassName: string
  tweet: ViewTweet_tweet
}> = ({ linkClassName, tweet }) => {
  return (
    <div className="whitespace-pre-wrap p-4">
      <Linkify
        tagName="span"
        options={{
          className: `break-words no-underline hover:underline ${linkClassName}`,
          formatHref: {
            mention: val => `https://twitter.com${val}`,
          },
          target: "_blank",
        }}
      >
        {tweet.body}
      </Linkify>
    </div>
  )
}

const TweetMedia: React.FC<{ tweet: ViewTweet_tweet }> = ({ tweet }) => {
  if (!tweet.mediaURLs.length) {
    return null
  }

  return (
    <div className="pb-4 px-4 -mx-1 flex flex-row">
      {tweet.mediaURLs.map((url, index) => (
        <figure key={index} className="m-0 py-0 px-1 w-1/4">
          <img src={url} className="w-full rounded-lg" />
        </figure>
      ))}
    </div>
  )
}
