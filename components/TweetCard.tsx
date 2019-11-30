import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ErrorContainer } from "./ErrorContainer"
import { ErrorBox } from "./ErrorBox"
import Card from "./Card"
import { TweetCard_tweet } from "../lib/__generated__/TweetCard_tweet.graphql"
import EditTweetForm from "./EditTweetForm"
import ViewTweet from "./ViewTweet"

interface Props {
  tweet: TweetCard_tweet
}

const TweetCard = ({ tweet }: Props) => {
  const [editing, setEditing] = React.useState(false)

  const appearance = tweet.status === "CANCELED" ? "canceled" : "normal"

  return (
    <ErrorContainer>
      <ErrorBox width={undefined} />
      <Card variant={appearance}>
        {editing ? (
          <EditTweetForm
            tweet={tweet}
            onStopEditing={() => setEditing(false)}
          />
        ) : (
          <ViewTweet tweet={tweet} onEdit={() => setEditing(true)} />
        )}
      </Card>
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
