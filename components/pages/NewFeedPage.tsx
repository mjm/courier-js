import React from "react"

import withSecurePage from "hocs/withSecurePage"
import Head from "components/Head"
import PreviewFeedForm from "components/PreviewFeedForm"
import PreviewFeedResult from "components/PreviewFeedResult"
import withData from "hocs/withData"

const NewFeedPage: React.FC = () => {
  const [url, setURL] = React.useState("")

  return (
    <main className="mx-auto max-w-lg">
      <Head title="Watch New Feed" />

      <PreviewFeedForm url={url} onChange={setURL} />
      <PreviewFeedResult url={url} />
    </main>
  )
}

export default withData(withSecurePage(NewFeedPage))
