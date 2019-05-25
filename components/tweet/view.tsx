import React, { useState } from "react"
import {
  AllTweetsFieldsFragment,
  TweetStatus,
  Tweet,
  CancelTweetComponent,
  UncancelTweetComponent,
  PostTweetComponent,
} from "../../lib/generated/graphql-components"
import Linkify from "linkifyjs/react"
import { BoxButtons } from "../box"
import { faEdit, faBan } from "@fortawesome/free-solid-svg-icons"
import { PillButton } from "../button"
import Moment from "react-moment"
import { spacing, colors } from "../../utils/theme"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import * as linkify from "linkifyjs"
import mention from "linkifyjs/plugins/mention"

mention(linkify)

interface ViewTweetProps {
  tweet: AllTweetsFieldsFragment
  user: any
  onEdit: () => void
}

const ViewTweet = ({ tweet, user, onEdit }: ViewTweetProps) => {
  return (
    <div>
      <div className="body">
        <Linkify
          options={{
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
        <div className="media">
          {tweet.mediaURLs.map(url => (
            <figure key={url}>
              <img src={url} />
            </figure>
          ))}
        </div>
      ) : null}
      <BoxButtons>
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            <PillButton icon={faEdit} invert onClick={onEdit}>
              Edit Tweet
            </PillButton>
            <PostButton id={tweet.id} />
          </>
        )}
        {tweet.status === TweetStatus.Canceled && (
          <div className="status">
            canceled. <UncancelButton id={tweet.id} />
          </div>
        )}
        {tweet.status === TweetStatus.Posted && (
          <div className="status">
            <a
              href={`https://twitter.com/${user.nickname}/status/${
                tweet.postedTweetID
              }`}
              target="_blank"
            >
              tweeted <Moment fromNow>{tweet.postedAt}</Moment>
            </a>
          </div>
        )}
      </BoxButtons>
      <style jsx>{`
        .body {
          white-space: pre-wrap;
          line-height: 1.5em;
        }
        .media {
          margin-top: ${spacing(3)};
          display: flex;
          flex-wrap: wrap;
        }
        figure {
          margin: 0;
          padding: 0 ${spacing(1)};
          width: 50%;
        }
        img {
          width: 100%;
          border-radius: 1rem;
        }
        .status {
          font-size: 0.9rem;
          font-style: italic;
          color: ${colors.gray[600]};
        }

        @media (min-width: 640px) {
          figure {
            width: 25%;
          }
        }
      `}</style>
    </div>
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
        <PillButton
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
        </PillButton>
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
        <PillButton
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
        </PillButton>
      )}
    </PostTweetComponent>
  )
}
