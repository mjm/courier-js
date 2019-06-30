import React, { useState } from "react"
import styled from "@emotion/styled"
import {
  AllTweetsFieldsFragment,
  TweetStatus,
  Tweet,
  CancelTweetComponent,
  UncancelTweetComponent,
  PostTweetComponent,
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

mention(linkify)

const StatusText = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  fontStyle: "italic",
  color: theme.colors.gray[600],
}))

interface ViewTweetProps {
  tweet: AllTweetsFieldsFragment
  user: any
  onEdit: () => void
}

const ViewTweet = ({ tweet, user, onEdit }: ViewTweetProps) => {
  return (
    <Group direction="column" spacing={3}>
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
        {tweet.body}
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
      <Group direction="row" spacing={2} wrap alignItems="center">
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            <Button icon={faEdit} invert onClick={onEdit}>
              Edit Tweet
            </Button>
            <PostButton id={tweet.id} />
            {tweet.postAfter && (
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
  return (
    <CancelTweetComponent>
      {cancelTweet => (
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
      )}
    </CancelTweetComponent>
  )
}

const UncancelButton = ({ id }: CancelButtonProps) => {
  return (
    <UncancelTweetComponent>
      {uncancelTweet => (
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
      )}
    </UncancelTweetComponent>
  )
}

const PostButton = ({ id }: CancelButtonProps) => {
  const [posting, setPosting] = useState(false)

  return (
    <PostTweetComponent>
      {postTweet => (
        <Button
          spin={posting}
          icon={faTwitter}
          color="blue"
          invert
          onClick={async () => {
            setPosting(true)
            try {
              await postTweet({
                variables: { input: { id } },
              })
            } catch (e) {
              console.error(e)
              setPosting(false)
            }
          }}
        >
          Post to Twitter
        </Button>
      )}
    </PostTweetComponent>
  )
}
