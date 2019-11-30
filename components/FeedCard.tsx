import Link from "next/link"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FeedCard_feed } from "../lib/__generated__/FeedCard_feed.graphql"
import Card, { CardHeader } from "./Card"
import {
  faHome,
  faHistory,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"
import Moment from "react-moment"
import URLText from "./URLText"
import styled from "@emotion/styled"
import Icon from "./Icon"

interface Props {
  feed: FeedCard_feed
}
const FeedCard: React.FC<Props> = ({ feed }) => {
  return (
    <Card css={{ a: { textDecoration: "none" } }}>
      <CardHeader>
        <Link href="/feeds/[id]" as={`/feeds/${feed.id}`}>
          <a>{feed.feed.title}</a>
        </Link>
      </CardHeader>
      <InfoLink href={feed.feed.homePageURL}>
        <InfoIcon icon={faHome} />
        <URLText>{feed.feed.homePageURL}</URLText>
      </InfoLink>
      {feed.feed.refreshedAt && (
        <InfoRow>
          <InfoIcon icon={faHistory} />
          <span>
            Checked <Moment fromNow>{feed.feed.refreshedAt}</Moment>
          </span>
        </InfoRow>
      )}
    </Card>
  )
}

export default createFragmentContainer(FeedCard, {
  feed: graphql`
    fragment FeedCard_feed on SubscribedFeed {
      id
      feed {
        id
        url
        title
        homePageURL
        micropubEndpoint
        refreshedAt
      }
      autopost
    }
  `,
})

const InfoRow = styled.div(({ theme }: any) => ({
  lineHeight: theme.lineHeights.normal,
  display: "flex",
  alignItems: "center",
}))
const InfoLink = InfoRow.withComponent("a")

type InfoIconProps = { icon: IconDefinition }
const InfoIcon = ({ icon }: InfoIconProps) => (
  <Icon icon={icon} fixedWidth mr={2} color="primary.700" />
)
