import React from "react"
import { QueryRenderer, graphql, ReactRelayContext } from "react-relay"
import { PreviewFeedResultQuery } from "@generated/PreviewFeedResultQuery.graphql"
import { ErrorBox } from "components/ErrorBox"
import Loading from "components/Loading"
import PreviewFeedContent from "components/PreviewFeedContent"

interface Props {
  url: string
  onWatch: () => Promise<void>
}
const PreviewFeedResult: React.FC<Props> = ({ url, onWatch }) => {
  const relayContext = React.useContext(ReactRelayContext)
  if (!relayContext) {
    return null
  }

  if (!url) {
    return null
  }

  return (
    <QueryRenderer<PreviewFeedResultQuery>
      environment={relayContext.environment}
      query={graphql`
        query PreviewFeedResultQuery($url: String!) {
          feedPreview(url: $url) {
            ...PreviewFeedContent_feed
          }
        }
      `}
      variables={{ url }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        }

        if (!props || !props.feedPreview) {
          return <Loading />
        }

        return <PreviewFeedContent feed={props.feedPreview} onWatch={onWatch} />
      }}
    />
  )
}

export default PreviewFeedResult
