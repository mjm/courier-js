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
  padding: `2px ${theme.space[3]}`,
  textTransform: "uppercase",
  borderRadius: "0 10px 0 6px",
  fontSize: theme.fontSizes[0],
  fontWeight: theme.fontWeights.bold,
}))

const TweetCardBanner = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.primary1,
  color: theme.colors.primary10,
  borderRadius: 20,
  textTransform: "uppercase",
  fontSize: theme.fontSizes[0],
  fontWeight: theme.fontWeights.bold,
  letterSpacing: "0.03em",
  boxShadow: theme.shadow.sm,

  display: "inline-block",
  padding: `${theme.space[1]} ${theme.space[3]}`,
}))

const TweetCardBase = styled.article(({ theme }: any) => ({
  borderRadius: "10px",
  boxShadow: theme.shadow.md,
  position: "relative",
  color: theme.colors.neutral8,
  lineHeight: theme.lineHeights.normal,
  paddingTop: theme.space[3],
  maxWidth: 500,
}))

interface TweetCardActionsProps {
  left?: React.ReactNode
  right?: React.ReactNode
  banner?: React.ReactNode
}

export const TweetCardActions: React.FC<TweetCardActionsProps> = ({
  left,
  right,
  banner,
}) => {
  return (
    <div
      css={theme => ({
        backgroundColor: theme.colors.neutral1,
        borderTop: `2px solid ${theme.colors.neutral2}`,
        padding: theme.space[3],
        borderRadius: "0 0 10px 10px",
        marginTop: banner ? 12 : 0,
      })}
    >
      {banner && (
        <div
          css={() => ({
            margin: "-29px auto 13px auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          })}
        >
          <TweetCardBanner>{banner}</TweetCardBanner>
        </div>
      )}
      <div css={{ display: "flex" }}>
        {left && (
          <div
            css={theme => ({
              "> *": {
                marginRight: theme.space[2],
              },
            })}
          >
            {left}
          </div>
        )}
        {right && <div css={{ marginLeft: "auto" }}>{right}</div>}
      </div>
    </div>
  )
}

const DraftTweetCard = styled(TweetCardBase)(({ theme }: any) => ({
  backgroundColor: "white",
  a: {
    color: theme.colors.primary9,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  // @ts-ignore
  [TweetStatusBadge]: {
    backgroundColor: theme.colors.primary6,
    color: theme.colors.primary1,
  },
}))
