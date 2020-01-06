import React from "react"

interface Props {
  url: string
}
const PreviewFeedResult: React.FC<Props> = ({ url }) => {
  return <div>{url}</div>
}

export default PreviewFeedResult
