import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ErrorContainer } from "components/ErrorContainer"
import {
  TweetCard_tweet,
  TweetStatus,
} from "@generated/TweetCard_tweet.graphql"
import EditTweetForm from "components/EditTweetForm"
import ViewTweet from "components/ViewTweet"
// import styled from "components/Styled"
import styled from "@emotion/styled"
import { ErrorBox } from "components/ErrorBox"

interface Props {
  tweet: TweetCard_tweet
}

const TweetCard: React.FC<Props> = ({ tweet }) => {
  const [editing, setEditing] = React.useState(false)

  const CardComponent = statusComponents[tweet.status]

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
    <TweetCardActionsContainer css={{ marginTop: banner ? 12 : 0 }}>
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
    </TweetCardActionsContainer>
  )
}

type FigureElementProps = React.HTMLAttributes<HTMLElement>

type TweetImageProps = FigureElementProps & {
  url: string
}
export const TweetImage: React.FC<TweetImageProps> = ({ url, ...props }) => {
  return (
    <TweetImageFigure style={{ backgroundImage: `url(${url})` }} {...props} />
  )
}

export const TweetBody = styled.div(({ theme }) => ({
  padding: theme.space[3],
}))

const TweetImageFigure = styled.figure(({ theme }) => ({
  width: "50%",
  paddingTop: "50%",
  height: 0,
  overflow: "hidden",
  margin: `0 ${theme.space[2]}`,
  boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.2)",
  borderRadius: "0.5rem",
  backgroundSize: "contain",
  [`@media (min-width: ${theme.breakpoints[0]})`]: {
    width: "25%",
    paddingTop: "25%",
  },
}))

const TweetCardBase = styled.article(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: theme.shadow.md,
  position: "relative",
  color: theme.colors.neutral8,
  lineHeight: theme.lineHeights.normal,
  paddingTop: theme.space[3],
  maxWidth: 500,

  // @ts-ignore
  [TweetBody]: {
    a: {
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}))

const TweetCardActionsContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.neutral1,
  borderTop: `2px solid ${theme.colors.neutral2}`,
  padding: theme.space[3],
  borderRadius: "0 0 10px 10px",
}))

const DraftTweetCard = styled(TweetCardBase)(({ theme }) => ({
  // @ts-ignore
  [TweetBody]: {
    a: {
      color: theme.colors.primary9,
    },
  },

  // @ts-ignore
  [TweetStatusBadge]: {
    backgroundColor: theme.colors.primary6,
    color: theme.colors.primary1,
  },
}))

const CanceledTweetCard = styled(TweetCardBase)(({ theme }) => ({
  backgroundColor: theme.colors.neutral3,
  color: theme.colors.neutral9,

  // @ts-ignore
  [TweetBody]: {
    a: {
      color: theme.colors.neutral10,
    },
  },

  // @ts-ignore
  [TweetStatusBadge]: {
    backgroundColor: theme.colors.neutral6,
    color: theme.colors.neutral1,
  },

  // @ts-ignore
  [TweetCardActionsContainer]: {
    backgroundColor: "transparent",
    border: 0,
    paddingTop: 0,
  },
}))

const PostedTweetCard = styled(TweetCardBase)(({ theme }) => ({
  // @ts-ignore
  [TweetBody]: {
    a: {
      color: theme.colors.secondary9,
    },
  },

  // @ts-ignore
  [TweetStatusBadge]: {
    backgroundColor: theme.colors.secondary7,
    color: theme.colors.secondary1,
  },
}))

const statusComponents: Record<TweetStatus, React.ComponentType> = {
  CANCELED: CanceledTweetCard,
  DRAFT: DraftTweetCard,
  POSTED: PostedTweetCard,
  "%future added value": DraftTweetCard,
}
