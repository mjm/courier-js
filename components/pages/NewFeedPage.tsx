import React from "react"
import { Environment } from "react-relay"

import { NextPage } from "next"
import Router from "next/router"

import { addFeed } from "@mutations/AddFeed"
import Head from "components/Head"
import PreviewFeedForm from "components/PreviewFeedForm"
import PreviewFeedResult from "components/PreviewFeedResult"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

const NewFeedPage: NextPage<{ environment: Environment }> = ({
  environment,
}) => {
  const [url, setURL] = React.useState("")

  async function watchFeed() {
    await addFeed(environment, url)
    Router.push("/feeds")
  }

  return (
    <main className="mx-auto max-w-lg">
      <Head title="Watch New Feed" />

      <PreviewFeedForm url={url} onChange={setURL} onWatch={watchFeed} />
      <div className="mt-4">
        <PreviewFeedResult url={url} onWatch={watchFeed} />
      </div>
    </main>
  )
}

export default withData(withSecurePage(NewFeedPage))
