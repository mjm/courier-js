import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ErrorContainer } from "./ErrorContainer"
import { ErrorBox } from "./ErrorBox"
import { TweetCard_tweet } from "../lib/__generated__/TweetCard_tweet.graphql"
import EditTweetForm from "./EditTweetForm"
import ViewTweet from "./ViewTweet"
import styled from "@emotion/styled"

interface Props {
  tweet: TweetCard_tweet
}

const TweetCard = ({ tweet }: Props) => {
  const [editing, setEditing] = React.useState(false)

  const CardComponent = DraftTweetCard

  // const appearance = tweet.status === "CANCELED" ? "canceled" : "normal"

  return (
    <ErrorContainer>
      <ErrorBox width={undefined} />
      <CardComponent>
        <TweetStatusBadge>{tweet.status}</TweetStatusBadge>
        {editing ? (
          <EditTweetForm
            tweet={tweet}
            onStopEditing={() => setEditing(false)}
          />
        ) : (
          <ViewTweet tweet={tweet} onEdit={() => setEditing(true)} />
        )}
      </CardComponent>
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

const TweetStatusBadge = styled.div(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  padding: `2px ${theme.space[2]}`,
  textTransform: "uppercase",
  borderRadius: "0 10px 0 6px",
  fontSize: theme.fontSizes[0],
  fontWeight: theme.fontWeights.bold,
}))

const TweetCardBase = styled.article(({ theme }: any) => ({
  borderRadius: "10px",
  boxShadow: theme.shadow.md,
  position: "relative",
  color: theme.colors.neutral8,
  lineHeight: theme.lineHeights.normal,
  paddingTop: theme.space[3],
}))

const DraftTweetCard = styled(TweetCardBase)(({ theme }: any) => ({
  backgroundColor: "white",
  a: {
    color: theme.colors.primary9,
  },
  // @ts-ignore
  [TweetStatusBadge]: {
    backgroundColor: theme.colors.primary6,
    color: theme.colors.primary1,
  },
}))
