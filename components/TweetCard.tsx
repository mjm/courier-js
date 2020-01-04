import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ErrorContainer } from "components/ErrorContainer"
import { ErrorBox } from "components/ErrorBox"
import {
  TweetCard_tweet,
  TweetStatus,
} from "@generated/TweetCard_tweet.graphql"
import EditTweetForm from "components/EditTweetForm"
import ViewTweet from "components/ViewTweet"

interface Props {
  tweet: TweetCard_tweet
}

const TweetCard = ({ tweet }: Props) => {
  const [editing, setEditing] = React.useState(false)

  return (
    <ErrorContainer>
      <ErrorBox width={undefined} />
      <CardContainer status={tweet.status}>
        <div
          className={`absolute top-0 right-0 py-1 px-4 uppercase rounded-tr-lg rounded-bl-lg text-xs font-bold ${
            cardTypeStyles[tweet.status].badge
          }`}
        >
          {tweet.status}
        </div>
        {editing ? (
          <EditTweetForm
            tweet={tweet}
            onStopEditing={() => setEditing(false)}
          />
        ) : (
          <ViewTweet tweet={tweet} onEdit={() => setEditing(true)} />
        )}
      </CardContainer>
    </ErrorContainer>
  )
}

export default createFragmentContainer(TweetCard, {
  tweet: graphql`
    fragment TweetCard_tweet on Tweet {
      status
      ...EditTweetForm_tweet
      ...ViewTweet_tweet
    }
  `,
})

interface CardContainerProps {
  status: TweetStatus
  children?: React.ReactNode
}
const CardContainer = ({ status, children }: CardContainerProps) => {
  const statusClass = cardTypeStyles[status].container

  return (
    <article
      className={`bg-white rounded-lg shadow-md relative text-neutral-8 leading-normal pt-4 max-w-lg ${statusClass}`}
    >
      {children}
    </article>
  )
}

interface CardTypeStyle {
  container: string
  badge: string
  actions: string
}
const cardTypeStyles: Record<TweetStatus, CardTypeStyle> = {
  CANCELED: {
    container: "bg-neutral-3 text-neutral-9",
    badge: "bg-neutral-6 text-neutral-1",
    actions: "bg-transparent shadow-none pt-0",
  },
  DRAFT: {
    container: "",
    badge: "bg-primary-6 text-primary-1",
    actions: "",
  },
  POSTED: {
    container: "",
    badge: "bg-secondary-7 text-secondary-1",
    actions: "",
  },
  "%future added value": {
    container: "",
    badge: "",
    actions: "",
  },
}
