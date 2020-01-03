import React from "react"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import Group from "./Group"
import styled from "@emotion/styled"
import Moment from "react-moment"
import Linkify from "linkifyjs/react"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import { URLContainer } from "./URLText"
import { Flex, Box, Image } from "@rebass/emotion"
import { useAuth } from "./AuthProvider"
import { faEdit, faBan } from "@fortawesome/free-solid-svg-icons"
import { Button } from "./Button"
import { ViewTweet_tweet } from "../lib/__generated__/ViewTweet_tweet.graphql"
import { cancelTweet } from "./mutations/CancelTweet"
import { uncancelTweet } from "./mutations/UncancelTweet"
import { useErrors } from "./ErrorContainer"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { postTweet } from "./mutations/PostTweet"
import { useSubscription } from "./SubscriptionProvider"

mention(linkify)

interface Props {
  tweet: ViewTweet_tweet
  onEdit: () => void
  relay: RelayProp
}

const ViewTweet = ({ tweet, onEdit, relay }: Props) => {
  const { user } = useAuth()
  const { isSubscribed } = useSubscription()

  return (
    <Group direction="column" spacing={3}>
      {tweet.action === "TWEET" ? (
        <>
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
      <Group direction="row" spacing={2} wrap alignItems="center">
        {tweet.status === "DRAFT" && (
          <>
            <CancelButton id={tweet.id} environment={relay.environment} />
            {tweet.action === "TWEET" ? (
              <Button icon={faEdit} invert onClick={onEdit}>
                Edit Tweet
              </Button>
            ) : null}
            <PostButton id={tweet.id} environment={relay.environment} />
            {isSubscribed && tweet.postAfter && (
              <StatusText css={{ display: "inline-block" }}>
                will post{" "}
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
              </StatusText>
            )}
          </>
        )}
        {tweet.status === "CANCELED" && (
          <StatusText>
            canceled.{" "}
            <UncancelButton id={tweet.id} environment={relay.environment} />
          </StatusText>
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
      </Group>
    </Group>
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

const StatusText = styled.div(({ theme }: any) => ({
  fontSize: theme.fontSizes[1],
  fontStyle: "italic",
  color: theme.colors.gray[600],
}))

interface ActionButtonProps {
  id: string
  environment: Environment
}

const CancelButton: React.FC<ActionButtonProps> = ({ id, environment }) => {
  return (
    <Button
      icon={faBan}
      color="red"
      invert
      onClick={() => {
        cancelTweet(environment, id)
      }}
    >
      Don't Post
    </Button>
  )
}

const UncancelButton: React.FC<ActionButtonProps> = ({ id, environment }) => {
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault()
        uncancelTweet(environment, id)
      }}
    >
      undo?
    </a>
  )
}

const PostButton: React.FC<ActionButtonProps> = ({ id, environment }) => {
  const { setError } = useErrors()

  return (
    <Button
      icon={faTwitter}
      color="blue"
      invert
      onClickAsync={async () => {
        try {
          await postTweet(environment, { id })
        } catch (e) {
          setError(e)
        }
      }}
    >
      Post to Twitter
    </Button>
  )
}
