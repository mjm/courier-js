import React from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import {
  AllTweetsComponent,
  AllTweetsFieldsFragment,
} from "../lib/generated/graphql-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { spacing, shadow, colors } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons"
import Loading from "../components/loading"

const Tweets = () => (
  <div className="container">
    <Head title="Feeds to Watch" />

    <PageHeader>Your Tweets</PageHeader>
    <p>These are the tweets Courier has translated from your feeds.</p>
    <TweetsList />
    <style jsx>{`
      .container {
        padding: 0 1rem 6rem 1rem;
      }

      .container > p {
        text-align: center;
      }
    `}</style>
  </div>
)

export default withSecurePage(withData(Tweets))

const TweetsList = () => {
  return (
    <div>
      <AllTweetsComponent>
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
      </AllTweetsComponent>
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
    <li>
      <div className="body">{tweet.body}</div>
      {tweet.mediaURLs.map(url => (
        <figure key={url}>
          <img src={url} style={{ width: "300px" }} />
        </figure>
      ))}
      <style jsx>{`
        li {
          background-color: white;
          padding: ${spacing(4)};
          box-shadow: ${shadow.md};
          margin-bottom: ${spacing(4)};
          border-top: 3px solid ${colors.primary[500]};
        }

        .body {
          white-space: pre-wrap;
        }
      `}</style>
    </li>
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
