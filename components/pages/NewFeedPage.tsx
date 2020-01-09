import React from "react"

import withSecurePage from "hocs/withSecurePage"
import Head from "components/Head"
import PreviewFeedForm from "components/PreviewFeedForm"
import PreviewFeedResult from "components/PreviewFeedResult"
import withData from "hocs/withData"
import { Environment } from "react-relay"
import { addFeed } from "@mutations/AddFeed"
import Router from "next/router"

interface Props {
  environment: Environment
}
const NewFeedPage: React.FC<Props> = ({ environment }) => {
  const [url, setURL] = React.useState("")

  async function watchFeed() {
    const feedId = await addFeed(environment, url)
    Router.push("/feeds/[id]", `/feeds/${feedId}`)
  }

  return (
    <main className="mx-auto max-w-lg">
      <Head title="Watch New Feed" />

      <PreviewFeedForm url={url} onChange={setURL} onWatch={watchFeed} />
      <PreviewFeedResult url={url} onWatch={watchFeed} />
    </main>
  )
}

export default withData(withSecurePage(NewFeedPage))
