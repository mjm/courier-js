import React from "react"
import Head from "../components/head"
import Nav from "../components/nav"
import { AllFeedsComponent } from "../lib/generated/graphql-components"
import withData from "../lib/apollo"

const Feeds = () => {
  return (
    <div>
      <Head />
      <Nav />
      <AllFeedsComponent>
        {({ data }) => {
          if (!data) {
            return null
          }

          const { allFeeds: feeds } = data
          return (
            <ul>
              {feeds.map(feed => (
                <li key={feed.id}>
                  <a href={feed.homePageURL}>{feed.title}</a>
                </li>
              ))}
            </ul>
          )
        }}
      </AllFeedsComponent>
    </div>
  )
}

export default withData(Feeds)
