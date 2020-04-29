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
import { ErrorContainer, useErrors } from "components/ErrorContainer"

const NewFeedPage: NextPage<{ environment: Environment }> = ({
  environment,
}) => {
  return (
    <main className="mx-auto max-w-lg">
      <Head title="Watch New Feed" />

      <ErrorContainer>
        <NewFeedContent environment={environment} />
      </ErrorContainer>
    </main>
  )
}

export default withData(withSecurePage(NewFeedPage))

const NewFeedContent: React.FC<{
  environment: Environment
}> = ({ environment }) => {
  const [url, setURL] = React.useState("")
  const { setError, clearErrors } = useErrors()

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
