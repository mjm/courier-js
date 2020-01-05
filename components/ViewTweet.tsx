import React from "react"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import Moment from "react-moment"
import Linkify from "linkifyjs/react"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import { Flex, Box, Image } from "@rebass/emotion"
import {
  ViewTweet_tweet,
  TweetStatus,
} from "@generated/ViewTweet_tweet.graphql"
import { cancelTweet } from "@mutations/CancelTweet"
import { uncancelTweet } from "@mutations/UncancelTweet"
import { useErrors } from "components/ErrorContainer"
import { postTweet } from "@mutations/PostTweet"
import { useSubscription } from "components/SubscriptionProvider"
import TweetCardActions from "components/TweetCardActions"
import AsyncButton from "components/AsyncButton"
import { useAuth } from "components/AuthProvider"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import Icon from "components/Icon"

mention(linkify)

interface Props {
  tweet: ViewTweet_tweet
  onEdit: () => void
  relay: RelayProp
}

const ViewTweet = ({ tweet, onEdit, relay }: Props) => {
  return (
    <>
      {tweet.action === "TWEET" ? (
        <>
          <div className="whitespace-pre-wrap p-4">
            <Linkify
              tagName="span"
              options={{
                className: `break-words no-underline hover:underline ${
                  linkStyles[tweet.status]
                }`,
                formatHref: {
                  mention: val => `https://twitter.com${val}`,
                },
                target: "_blank",
              }}
            >
              {tweet.body}
            </Linkify>
          </div>
          {tweet.mediaURLs.length ? (
            <Flex mt={2} flexWrap="wrap">
              {tweet.mediaURLs.map(url => (
                <Box
                  key={url}
                  as="figure"
                  width={[1 / 2, 1 / 4]}
                  m={0}
                  py={0}
                  px={1}
                >
                  <Image width={1} borderRadius="1rem" src={url} />
                </Box>
              ))}
            </Flex>
          ) : null}
        </>
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

export default createFragmentContainer(ViewTweet, {
  tweet: graphql`
    fragment ViewTweet_tweet on Tweet {
      id
      body
      mediaURLs
      status
      action
      postAfter
      postedAt
      postedTweetID
      retweetID
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
  tweet: ViewTweet_tweet
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
        Autoposting{" "}
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
            className="btn btn-first btn-first-primary"
            onClick={async () => {
              try {
                await postTweet(environment, { id: tweet.id })
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
          onClick={() => cancelTweet(environment, tweet.id)}
        >
          Don't post
        </button>
      }
    />
  )
}

interface CanceledActionsProps {
  tweet: ViewTweet_tweet
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
          onClick={() => uncancelTweet(environment, tweet.id)}
        >
          Restore draft
        </button>
      }
    />
  )
}

interface PostedActionsProps {
  tweet: ViewTweet_tweet
}

const PostedActions: React.FC<PostedActionsProps> = ({ tweet }) => {
  const { user } = useAuth()

  return (
    <TweetCardActions
      left={
        <a
          href={`https://twitter.com/${user.nickname}/status/${tweet.postedTweetID}`}
          target="_blank"
          className="btn btn-third btn-third-secondary"
        >
          Posted <Moment fromNow>{tweet.postedAt}</Moment>{" "}
          <Icon ml={1} icon={faExternalLinkAlt} />
        </a>
      }
    />
  )
}
