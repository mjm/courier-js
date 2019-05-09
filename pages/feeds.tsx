import React from "react"
import Head from "../components/head"
import Nav from "../components/nav"
import { AllFeedsComponent } from "../lib/generated/graphql-components"
import withData from "../lib/apollo"

const Feeds = () => {
  return (
    <div>
      <Head title="Feeds to Watch" />
      <Nav />

      <div className="container">
        <h1>Feeds to Watch</h1>
        <p>
          The feeds you add here will be checked for new posts that need to be
          tweeted.
        </p>
        <AllFeedsComponent>
          {({ data, error }) => {
            if (error) {
              return <p>{error.message}</p>
            }

            if (!data) {
              return null
            }

            const { allFeeds: feeds } = data
            return (
              <ul className="feeds">
                {feeds.map(feed => (
                  <li key={feed.id}>
                    <h3>
                      <a href={feed.homePageURL}>{feed.title}</a>
                    </h3>
                    <div>
                      Home: <a href={feed.homePageURL}>{feed.homePageURL}</a>
                    </div>
                    <div>
                      Feed: <a href={feed.url}>{feed.url}</a>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }}
        </AllFeedsComponent>
      </div>
      <style jsx>{`
        .container {
          padding: 0 1rem;
        }

        .feeds {
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        .feeds li {
          padding: 1rem;
          border: 1px solid turquoise;
          border-radius: 0.5rem;
        }

        h3 {
          font-size: 1.2rem;
          margin: 0;
          margin-bottom: 0.6rem;
        }

        a {
          color: #222;
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

export default withData(Feeds)
