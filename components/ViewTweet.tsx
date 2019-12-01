import React from "react"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import styled from "@emotion/styled"
import Moment from "react-moment"
import Linkify from "linkifyjs/react"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import { URLContainer } from "./URLText"
import { Flex, Box, Image } from "@rebass/emotion"
import { useAuth } from "./AuthProvider"
import { ViewTweet_tweet } from "@generated/ViewTweet_tweet.graphql"
import { cancelTweet } from "@mutations/CancelTweet"
import { uncancelTweet } from "@mutations/UncancelTweet"
import { postTweet } from "@mutations/PostTweet"
import { TweetCardActions } from "./TweetCard"
import { Button } from "./Buttons"
import { useErrors } from "./ErrorContainer"
import { useSubscription } from "./SubscriptionProvider"

mention(linkify)

interface Props {
  tweet: ViewTweet_tweet
  onEdit: () => void
  relay: RelayProp
}

const ViewTweet = ({ tweet, onEdit, relay }: Props) => {
  const { user } = useAuth()

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
      {tweet.status === "POSTED" && (
        <StatusText>
          <a
            href={`https://twitter.com/${user.nickname}/status/${tweet.postedTweetID}`}
            target="_blank"
          >
            tweeted <Moment fromNow>{tweet.postedAt}</Moment>
          </a>
        </StatusText>
      )}
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

const TweetBody = styled.div(({ theme }) => ({
  padding: theme.space[3],
}))

const StatusText = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  fontStyle: "italic",
  color: theme.colors.gray[600],
}))

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
