import React from "react"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import {
  AllTweetsComponent,
  AllTweetsFieldsFragment,
} from "../lib/generated/graphql-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"

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
            return <p>Loading...</p>
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
                  <button type="button" onClick={loadMore}>
                    Load More…
                  </button>
                </li>
              )}
            </ul>
          )
        }}
      </AllTweetsComponent>
    </div>
  )
}

interface TweetCardProps {
  tweet: AllTweetsFieldsFragment
}

const TweetCard = ({ tweet }: TweetCardProps) => {
  return (
    <li>
      <p>{tweet.body}</p>
      {tweet.mediaURLs.map(url => (
        <figure key={url}>
          <img src={url} style={{ width: "300px" }} />
        </figure>
      ))}
    </li>
  )
}
