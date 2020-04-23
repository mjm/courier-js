import React from "react"
import Moment from "react-moment"
import {
  createFragmentContainer,
  Environment,
  graphql,
  RelayProp,
} from "react-relay"

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
  TweetStatus,
  ViewTweetGroup_tweet,
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
  tweet: ViewTweetGroup_tweet
  onEdit: () => void
  relay: RelayProp
}> = ({ tweet, onEdit, relay }) => {
  return (
    <>
      {tweet.action === "TWEET" ? (
        tweet.tweets.map((t, i) => (
          <ViewTweet
            key={i}
            linkClassName={linkStyles[tweet.status || "DRAFT"]}
            tweet={t}
          />
        ))
      ) : (
        <div>
          <a
            href={`https://twitter.com/user/status/${tweet.retweetID}`}
            target="_blank"
          >
            Retweet
          </a>
        </div>
      )}
      {tweet.status === "DRAFT" && (
        <DraftActions
          tweet={tweet}
          environment={relay.environment}
          onEdit={onEdit}
        />
      )}
      {tweet.status === "CANCELED" && (
        <CanceledActions tweet={tweet} environment={relay.environment} />
      )}
      {tweet.status === "POSTED" && <PostedActions tweet={tweet} />}
    </>
  )
}

export default createFragmentContainer(ViewTweetGroup, {
  tweet: graphql`
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
})

const linkStyles: Record<TweetStatus, string> = {
  DRAFT: "text-primary-9",
  CANCELED: "text-neutral-10",
  POSTED: "text-secondary-9",
  "%future added value": "",
}

interface DraftActionsProps {
  tweet: ViewTweetGroup_tweet
  environment: Environment
  onEdit: () => void
}
const DraftActions: React.FC<DraftActionsProps> = ({
  tweet,
  environment,
  onEdit,
}) => {
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
  environment: Environment
}

const CanceledActions: React.FC<CanceledActionsProps> = ({
  tweet,
  environment,
}) => {
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
