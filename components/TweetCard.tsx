import React from "react"
import { graphql } from "react-relay"
import { useFragment } from "react-relay/hooks"

import {
  TweetCard_tweet$key,
  TweetStatus,
} from "@generated/TweetCard_tweet.graphql"
import EditTweetForm from "components/EditTweetForm"
import { ErrorBox } from "components/ErrorBox"
import { ErrorContainer } from "components/ErrorContainer"
import ViewTweetGroup from "components/ViewTweetGroup"

const TweetCard: React.FC<{
  tweet: TweetCard_tweet$key
}> = ({ tweet }) => {
  const data = useFragment(
    graphql`
      fragment TweetCard_tweet on TweetContent {
        ...EditTweetForm_tweet
        ...ViewTweetGroup_tweet

        ... on TweetGroup {
          status
        }
      }
    `,
    tweet
  )

  const [editing, setEditing] = React.useState(false)
  const statusClass = data.status ? cardTypeStyles[data.status].container : ""

  return (
    <ErrorContainer>
      <ErrorBox />
      <article
        className={`bg-white rounded-lg shadow-md relative text-neutral-8 leading-normal mb-4 pt-4 ${statusClass}`}
      >
        <div
          className={`absolute top-0 right-0 py-1 px-4 uppercase rounded-tr-lg rounded-bl-lg text-xs font-bold ${
            cardTypeStyles[data.status || "DRAFT"].badge
          }`}
        >
          {data.status || "PREVIEW"}
        </div>
        {editing ? (
          <EditTweetForm tweet={data} onStopEditing={() => setEditing(false)} />
        ) : (
          <ViewTweetGroup tweet={data} onEdit={() => setEditing(true)} />
        )}
      </article>
    </ErrorContainer>
  )
}

export default TweetCard

interface CardTypeStyle {
  container: string
  badge: string
  actions: string
}
const cardTypeStyles: Record<TweetStatus, CardTypeStyle> = {
  CANCELED: {
    container: "bg-neutral-3 text-neutral-9",
    badge: "bg-neutral-4 text-neutral-9",
    actions: "bg-transparent shadow-none pt-0",
  },
  DRAFT: {
    container: "",
    badge: "bg-primary-1 text-primary-5",
    actions: "",
  },
  POSTED: {
    container: "",
    badge: "bg-secondary-1 text-secondary-7",
    actions: "",
  },
  "%future added value": {
    container: "",
    badge: "",
    actions: "",
  },
}
