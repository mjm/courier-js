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
import { URLContainer } from "./URLText"
import { Flex } from "@rebass/emotion"
import { useAuth } from "./AuthProvider"
import { ViewTweet_tweet } from "@generated/ViewTweet_tweet.graphql"
import { cancelTweet } from "@mutations/CancelTweet"
import { uncancelTweet } from "@mutations/UncancelTweet"
import { postTweet } from "@mutations/PostTweet"
import { TweetCardActions, TweetBody, TweetImage } from "components/TweetCard"
import { Button } from "./Buttons"
import { useErrors } from "./ErrorContainer"
import { useSubscription } from "./SubscriptionProvider"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import Icon from "components/Icon"

mention(linkify)

interface Props {
  tweet: ViewTweet_tweet
  onEdit: () => void
  relay: RelayProp
}

const ViewTweet = ({ tweet, onEdit, relay: { environment } }: Props) => {
  return (
    <>
      {tweet.action === "TWEET" ? (
        <>
          <TweetBody>
            <Linkify
              tagName="div"
              options={{
                formatHref: {
                  mention: val => `https://twitter.com${val}`,
                },
                target: "_blank",
              }}
              css={{ whiteSpace: "pre-wrap" }}
            >
              <URLContainer>{tweet.body}</URLContainer>
            </Linkify>
          </TweetBody>
          {tweet.mediaURLs.length ? (
            <Flex mb={3} px={2} flexWrap="wrap">
              {tweet.mediaURLs.map(url => (
                <TweetImage key={url} url={url} />
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
        <DraftActions tweet={tweet} environment={environment} onEdit={onEdit} />
      )}
      {tweet.status === "CANCELED" && (
        <CanceledActions tweet={tweet} environment={environment} />
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
          <Button
            color="primary"
            onClickAsync={async () => {
              try {
                await postTweet(environment, { id: tweet.id })
              } catch (e) {
                setError(e)
              }
            }}
          >
            Post now
          </Button>
          <Button color="neutral" variant="secondary" onClick={onEdit}>
            Edit
          </Button>
        </>
      }
      right={
        <Button
          color="neutral"
          variant="tertiary"
          onClick={() => cancelTweet(environment, tweet.id)}
        >
          Don't post
        </Button>
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
      left={
        <Button
          color="neutral"
          onClick={() => uncancelTweet(environment, tweet.id)}
        >
          Restore draft
        </Button>
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
        <Button
          color="secondary"
          variant="tertiary"
          href={`https://twitter.com/${user.nickname}/status/${tweet.postedTweetID}`}
          target="_blank"
        >
          Posted <Moment fromNow>{tweet.postedAt}</Moment>{" "}
          <Icon ml={1} icon={faExternalLinkAlt} />
        </Button>
      }
    />
  )
}
