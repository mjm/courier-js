import React from "react"
import { useRelayEnvironment } from "react-relay/hooks"

import { NextPage } from "next"
import Router from "next/router"

import { addFeed } from "@mutations/AddFeed"
import { ErrorContainer, useErrors } from "components/ErrorContainer"
import Head from "components/Head"
import PreviewFeedForm from "components/PreviewFeedForm"
import PreviewFeedResult from "components/PreviewFeedResult"
import withSecurePage from "hocs/withSecurePage"

const NewFeedPage: NextPage = () => {
  return (
    <main className="mx-auto max-w-lg">
      <Head title="Watch New Feed" />

      <ErrorContainer>
        <NewFeedContent />
      </ErrorContainer>
    </main>
  )
}

export default withSecurePage(NewFeedPage)

const NewFeedContent: React.FC = () => {
  const [url, setURL] = React.useState("")
  const { setError, clearErrors } = useErrors()
  const environment = useRelayEnvironment()

  async function watchFeed(): Promise<void> {
    try {
      await addFeed(environment, url)
      await Router.push("/feeds")
    } catch (e) {
      setError(e)
    }
  }

  function onChangeURL(url: string): void {
    setURL(url)
    clearErrors()
  }

  return (
    <>
      <PreviewFeedForm url={url} onChange={onChangeURL} onWatch={watchFeed} />
      <div className="mt-4">
        <PreviewFeedResult url={url} onWatch={watchFeed} />
      </div>
    </>
  )
}
