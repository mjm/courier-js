import React from "react"
import Moment from "react-moment"
import { graphql } from "react-relay"
import { useFragment, useRelayEnvironment } from "react-relay/hooks"

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
  TweetStatus,
  ViewTweetGroup_tweet,
  ViewTweetGroup_tweet$key,
} from "@generated/ViewTweetGroup_tweet.graphql"
import { cancelTweet } from "@mutations/CancelTweet"
import { postTweet } from "@mutations/PostTweet"
import { uncancelTweet } from "@mutations/UncancelTweet"
import AsyncButton from "components/AsyncButton"
import { useAuth } from "components/AuthProvider"
import { useErrors } from "components/ErrorContainer"
import { useSubscription } from "components/SubscriptionProvider"
import TweetCardActions from "components/TweetCardActions"
import ViewTweet from "components/ViewTweet"

const ViewTweetGroup: React.FC<{
  tweet: ViewTweetGroup_tweet$key
  onEdit: () => void
}> = ({ tweet, onEdit }) => {
  const data = useFragment(
    graphql`
      fragment ViewTweetGroup_tweet on TweetContent {
        tweets {
          ...ViewTweet_tweet
          body
          mediaURLs
          postedTweetID
        }
        action
        retweetID

        ... on TweetGroup {
          id
          status
          postAfter
          postedAt
          postedRetweetID
        }
      }
    `,
    tweet
  )

  return (
    <>
      {data.action === "TWEET" ? (
        data.tweets.map((t, i) => (
          <ViewTweet
            key={i}
            linkClassName={linkStyles[data.status || "DRAFT"]}
            tweet={t}
          />
        ))
      ) : (
        <div>
          <a
            href={`https://twitter.com/user/status/${data.retweetID}`}
            target="_blank"
          >
            Retweet
          </a>
        </div>
      )}
      {data.status === "DRAFT" && <DraftActions tweet={data} onEdit={onEdit} />}
      {data.status === "CANCELED" && <CanceledActions tweet={data} />}
      {data.status === "POSTED" && <PostedActions tweet={data} />}
    </>
  )
}

export default ViewTweetGroup

const linkStyles: Record<TweetStatus, string> = {
  DRAFT: "text-primary-9",
  CANCELED: "text-neutral-10",
  POSTED: "text-secondary-9",
  "%future added value": "",
}

interface DraftActionsProps {
  tweet: ViewTweetGroup_tweet
  onEdit: () => void
}
const DraftActions: React.FC<DraftActionsProps> = ({ tweet, onEdit }) => {
  const environment = useRelayEnvironment()
  const { isSubscribed } = useSubscription()
  const { setError } = useErrors()

  let banner: React.ReactNode = null
  if (isSubscribed && tweet.postAfter) {
    banner = (
      <>
        Posting{" "}
        <Moment
          fromNow
          filter={str => {
            if (str.includes("ago")) {
              return "soon"
            } else {
              return str
            }
          }}
        >
          {tweet.postAfter}
        </Moment>
      </>
    )
  }

  return (
    <TweetCardActions
      banner={banner}
      left={
        <>
          <AsyncButton
            className="btn btn-first btn-first-primary mr-2"
            onClick={async () => {
              try {
                await postTweet(environment, { id: tweet.id as string })
              } catch (e) {
                setError(e)
              }
            }}
          >
            Post now
          </AsyncButton>
          <button
            className="btn btn-second btn-second-neutral"
            onClick={onEdit}
          >
            Edit
          </button>
        </>
      }
      right={
        <button
          className="btn btn-third btn-third-neutral"
          onClick={() => cancelTweet(environment, tweet.id as string)}
        >
          Don't post
        </button>
      }
    />
  )
}

interface CanceledActionsProps {
  tweet: ViewTweetGroup_tweet
}

const CanceledActions: React.FC<CanceledActionsProps> = ({ tweet }) => {
  const environment = useRelayEnvironment()

  return (
    <TweetCardActions
      inline
      left={
        <button
          className="btn btn-first btn-first-neutral"
          onClick={() => uncancelTweet(environment, tweet.id as string)}
        >
          Restore draft
        </button>
      }
    />
  )
}

interface PostedActionsProps {
  tweet: ViewTweetGroup_tweet
}

const PostedActions: React.FC<PostedActionsProps> = ({ tweet }) => {
  const { user } = useAuth()

  const postedID =
    tweet.action == "TWEET"
      ? tweet.tweets[0].postedTweetID
      : tweet.postedRetweetID

  return (
    <TweetCardActions
      left={
        <a
          href={`https://twitter.com/${user?.nickname ??
            "user"}/status/${postedID}`}
          target="_blank"
          className="btn btn-third btn-third-secondary"
        >
          Posted <Moment fromNow>{tweet.postedAt}</Moment>{" "}
          <FontAwesomeIcon className="ml-1" icon={faExternalLinkAlt} />
        </a>
      }
    />
  )
}
