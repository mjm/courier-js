import React from "react"
import { graphql } from "react-relay"
import { useLazyLoadQuery } from "react-relay/hooks"

import { PreviewFeedResultQuery } from "@generated/PreviewFeedResultQuery.graphql"
import PreviewFeedContent from "components/PreviewFeedContent"

const PreviewFeedResult: React.FC<{
  url: string
  onWatch: () => Promise<void>
}> = ({ url, onWatch }) => {
  const data = useLazyLoadQuery<PreviewFeedResultQuery>(
    graphql`
      query PreviewFeedResultQuery($url: String!) {
        feedPreview(url: $url) {
          ...PreviewFeedContent_feed
        }
      }
    `,
    { url }
  )

  if (!data?.feedPreview) {
    return null
  }

  return <PreviewFeedContent feed={data.feedPreview} onWatch={onWatch} />
}

export default PreviewFeedResult
