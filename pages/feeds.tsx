import React from "react"
import { NextContext } from "next"
import Head from "../components/head"
import Nav from "../components/nav"
import fetch from "isomorphic-unfetch"
import url from "../lib/url"
import { Feed } from "../lib/data/types"

interface Props {
  feeds: Feed[]
}

const Feeds = ({ feeds }: Props) => {
  return (
    <div>
      <Head />
      <Nav />

      <ul>
        {feeds.map(feed => (
          <li key={feed.id}>{feed.url}</li>
        ))}
      </ul>
    </div>
  )
}

Feeds.getInitialProps = async ({ req }: NextContext) => {
  const props = { feeds: [] }

  try {
    const response = await fetch(url("/api/feeds", req))
    const feeds = await response.json()
    props.feeds = feeds
  } catch (e) {
    console.error(e.message)
  }

  return props
}

export default Feeds
