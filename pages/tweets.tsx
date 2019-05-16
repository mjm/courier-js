import React, { useState } from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import {
  UpcomingTweetsComponent,
  PastTweetsComponent,
  AllTweetsFieldsFragment,
  Tweet,
  CancelTweetComponent,
  TweetStatus,
  UncancelTweetComponent,
  PostTweetComponent,
} from "../lib/generated/graphql-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { spacing, shadow, colors, font } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDoubleDown,
  faBan,
  faUndoAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import Loading from "../components/loading"
import { PillButton } from "../components/button"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import Moment from "react-moment"

const Tweets = () => (
  <div className="container">
    <Head title="Feeds to Watch" />

    <PageHeader>Your Tweets</PageHeader>
    <p>These are the tweets Courier has translated from your feeds.</p>
    <h2>Upcoming Tweets</h2>
    <TweetsList query={UpcomingTweetsComponent} />
    <h2>Past Tweets</h2>
    <TweetsList query={PastTweetsComponent} />
    <style jsx>{`
      .container {
        padding: 0 1rem 6rem 1rem;
      }
      .container > p {
        text-align: center;
      }
      h2 {
        font-family: ${font.display};
        color: ${colors.primary[900]};
        letter-spacing: -0.025em;
      }
    `}</style>
  </div>
)

export default withSecurePage(withData(Tweets))

interface TweetsListProps {
  // this type should match both upcoming and past.
  // we just had to pick one to use to grab the type
  query: typeof UpcomingTweetsComponent
}
const TweetsList = ({ query: QueryComponent }: TweetsListProps) => {
  return (
    <div>
      <QueryComponent>
        {({ data, error, loading, fetchMore }) => {
          if (loading) {
            return <Loading />
          }

          if (error) {
            return <p>{error.message}</p>
          }

          if (!data) {
            return null
          }

          const loadMore = () => {
            fetchMore({
              variables: {
                cursor: pageInfo.endCursor,
              },
              updateQuery(previousResult, { fetchMoreResult }) {
                if (!fetchMoreResult) {
                  return previousResult
                }
                const oldNodes = previousResult.allTweets.nodes
                const { nodes: newNodes, pageInfo } = fetchMoreResult.allTweets

                return {
                  allTweets: {
                    __typename: "TweetConnection",
                    nodes: [...oldNodes, ...newNodes],
                    pageInfo,
                  },
                }
              },
            })
          }

          const { nodes, pageInfo } = data.allTweets
          return (
            <ul>
              {nodes.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
              {pageInfo.hasPreviousPage && (
                <li>
                  <LoadMoreButton onClick={loadMore} />
                </li>
              )}
            </ul>
          )
        }}
      </QueryComponent>
      <style jsx>{`
        ul {
          list-style: none;
          padding-left: 0;
        }
      `}</style>
    </div>
  )
}

interface TweetCardProps {
  tweet: AllTweetsFieldsFragment
}

const TweetCard = ({ tweet }: TweetCardProps) => {
  return (
    <li className={`${tweet.status.toLowerCase()}`}>
      <div className="body">{tweet.body}</div>
      {tweet.mediaURLs.map(url => (
        <figure key={url}>
          <img src={url} style={{ width: "300px" }} />
        </figure>
      ))}
      <div className="buttons">
        {tweet.status === TweetStatus.Draft && (
          <>
            <CancelButton id={tweet.id} />
            <PostButton id={tweet.id} />
          </>
        )}
        {tweet.status === TweetStatus.Canceled && (
          <>
            Canceled. <UncancelButton id={tweet.id} />
          </>
        )}
        {tweet.status === TweetStatus.Posted && (
          <>
            Posted to Twitter{" "}
            <a
              href={`https://twitter.com/user/status/${tweet.postedTweetID}`}
              target="_blank"
            >
              <Moment fromNow>{tweet.postedAt}</Moment>
            </a>
          </>
        )}
      </div>
      <style jsx>{`
        li {
          background-color: white;
          padding: ${spacing(4)};
          box-shadow: ${shadow.md};
          margin-bottom: ${spacing(4)};
          border-top: 3px solid ${colors.primary[500]};
        }
        li.canceled {
          background-color: ${colors.gray[200]};
          border-top-color: ${colors.gray[400]};
        }
        .body {
          white-space: pre-wrap;
        }
        .buttons {
          margin-top: ${spacing(3)};
        }
        a {
          color: ${colors.primary[700]};
        }
      `}</style>
    </li>
  )
}

interface CancelButtonProps {
  id: Tweet["id"]
}
const CancelButton = ({ id }: CancelButtonProps) => {
  return (
    <CancelTweetComponent>
      {cancelTweet => (
        <PillButton
          onClick={() => {
            cancelTweet({
              variables: { id },
              optimisticResponse: {
                __typename: "Mutation",
                cancelTweet: {
                  __typename: "Tweet",
                  id,
                  status: TweetStatus.Canceled,
                },
              },
            })
          }}
        >
          <FontAwesomeIcon icon={faBan} />
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
        <PillButton
          onClick={() => {
            uncancelTweet({
              variables: { id },
              optimisticResponse: {
                __typename: "Mutation",
                uncancelTweet: {
                  __typename: "Tweet",
                  id,
                  status: TweetStatus.Draft,
                },
              },
            })
          }}
        >
          <FontAwesomeIcon icon={faUndoAlt} />
          Undo
        </PillButton>
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
          disabled={posting}
          onClick={async () => {
            setPosting(true)
            try {
              await postTweet({
                variables: { id },
              })
            } catch (e) {
              console.error(e)
              setPosting(false)
            }
          }}
        >
          <FontAwesomeIcon
            icon={posting ? faSpinner : faTwitter}
            spin={posting}
          />
          Post to Twitter
        </PillButton>
      )}
    </PostTweetComponent>
  )
}

type LoadMoreButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["button"]
>
const LoadMoreButton = ({ children, ...props }: LoadMoreButtonProps) => (
  <button type="button" {...props}>
    <FontAwesomeIcon icon={faAngleDoubleDown} />
    {children || "Load More…"}
    <style jsx>{`
      button {
        display: block;
        margin: 0 auto;
        padding: ${spacing(1)} ${spacing(3)};
        border: 0;
        background-color: ${colors.primary[500]};
        color: white;
        font-size: 1.2rem;
        font-weight: 500;
        border-radius: 0.5rem;
        box-shadow: ${shadow.md};
      }
      button > :global(svg) {
        margin-right: ${spacing(1)};
      }
    `}</style>
  </button>
)
