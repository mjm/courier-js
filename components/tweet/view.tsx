import React from "react"
import styled from "@emotion/styled"
import {
  AllTweetsFieldsFragment,
  TweetStatus,
  Tweet,
  TweetAction,
  useCancelTweetMutation,
  useUncancelTweetMutation,
  usePostTweetMutation,
} from "../../lib/generated/graphql-components"
import Linkify from "linkifyjs/react"
import { faEdit, faBan } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../button"
import Moment from "react-moment"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"
import Group from "../group"
import { Image, Box, Flex } from "@rebass/emotion"
import { URLContainer } from "../url"
import { useAuth } from "../../hooks/auth"
import { useSubscription } from "../../hooks/subscription"
import { useErrors } from "../../hooks/error"

mention(linkify)

const StatusText = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  fontStyle: "italic",
  color: theme.colors.gray[600],
}))

interface ViewTweetProps {
  tweet: AllTweetsFieldsFragment
  onEdit: () => void
}

const ViewTweet = ({ tweet, onEdit }: ViewTweetProps) => {
  const { user } = useAuth()
  const { isSubscribed } = useSubscription()

  return (
    <Group direction="column" spacing={3}>
      {tweet.action === TweetAction.Tweet ? (
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
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            {tweet.action === TweetAction.Tweet ? (
              <Button icon={faEdit} invert onClick={onEdit}>
                Edit Tweet
              </Button>
            ) : null}
            <PostButton id={tweet.id} />
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
        {tweet.status === TweetStatus.Canceled && (
          <StatusText>
            canceled. <UncancelButton id={tweet.id} />
          </StatusText>
        )}
        {tweet.status === TweetStatus.Posted && (
          <StatusText>
            <a
              href={`https://twitter.com/${user.nickname}/status/${
                tweet.postedTweetID
              }`}
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

export default ViewTweet

interface CancelButtonProps {
  id: Tweet["id"]
}
const CancelButton = ({ id }: CancelButtonProps) => {
  const [cancelTweet] = useCancelTweetMutation()

  return (
    <Button
      icon={faBan}
      color="red"
      invert
      onClick={() => {
        cancelTweet({
          variables: { input: { id } },
          optimisticResponse: {
            __typename: "Mutation",
            cancelTweet: {
              __typename: "CancelTweetPayload",
              tweet: {
                __typename: "Tweet",
                id,
                status: TweetStatus.Canceled,
              },
            },
          },
        })
      }}
    >
      Don't Post
    </Button>
  )
}

const UncancelButton = ({ id }: CancelButtonProps) => {
  const [uncancelTweet] = useUncancelTweetMutation()

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault()
        uncancelTweet({
          variables: { input: { id } },
          optimisticResponse: {
            __typename: "Mutation",
            uncancelTweet: {
              __typename: "UncancelTweetPayload",
              tweet: {
                __typename: "Tweet",
                id,
                status: TweetStatus.Draft,
              },
            },
          },
        })
      }}
    >
      undo?
    </a>
  )
}

const PostButton = ({ id }: CancelButtonProps) => {
  const { setError } = useErrors()
  const [postTweet] = usePostTweetMutation()

  return (
    <Button
      icon={faTwitter}
      color="blue"
      invert
      onClickAsync={async () => {
        try {
          await postTweet({
            variables: { input: { id } },
          })
        } catch (e) {
          setError(e)
        }
      }}
    >
      Post to Twitter
    </Button>
  )
}
