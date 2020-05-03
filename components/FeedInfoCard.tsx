import React from "react"
import Moment from "react-moment"
import { fetchQuery, graphql } from "react-relay"
import { useFragment, useRelayEnvironment } from "react-relay/hooks"

import {
  FeedInfoCard_feed,
  FeedInfoCard_feed$key,
} from "@generated/FeedInfoCard_feed.graphql"
import {
  FeedInfoCard_user,
  FeedInfoCard_user$key,
} from "@generated/FeedInfoCard_user.graphql"
import { FeedInfoCardEndpointsQuery } from "@generated/FeedInfoCardEndpointsQuery.graphql"
import { refreshFeed } from "@mutations/RefreshFeed"
import { setFeedOptions } from "@mutations/SetFeedOptions"
import AsyncButton from "components/AsyncButton"
import { useErrors } from "components/ErrorContainer"
import { beginIndieAuth } from "utils/indieauth"

const FeedInfoCard: React.FC<{
  feed: FeedInfoCard_feed$key
  user: FeedInfoCard_user$key
}> = props => {
  const feed = useFragment(
    graphql`
      fragment FeedInfoCard_feed on Feed {
        id
        url
        homePageURL
        micropubEndpoint
        refreshedAt
        refreshing
        autopost
      }
    `,
    props.feed
  )

  const user = useFragment(
    graphql`
      fragment FeedInfoCard_user on Viewer {
        micropubSites
      }
    `,
    props.user
  )

  return (
    <div className="rounded-lg shadow-md bg-neutral-1 p-4">
      <div className="flex flex-wrap -mx-4 -mb-4">
        <LastCheckedSection feed={feed} />
        <AutopostSection feed={feed} />
        <MicropubSection feed={feed} user={user} />
      </div>
    </div>
  )
}

export default FeedInfoCard

const InfoSection: React.FC<{
  className?: string
  label: React.ReactNode
  buttonLabel: string
  onClick: () => Promise<void>
}> = ({ className, label, buttonLabel, onClick }) => {
  return (
    <div className={`w-1/2 md:w-full px-4 mb-4 ${className || ""}`}>
      <div className="text-neutral-7 text-sm mb-2">{label}</div>
      <AsyncButton
        className="w-full btn btn-second border-neutral-4 text-neutral-8 font-medium"
        type="button"
        onClick={onClick}
      >
        {buttonLabel}
      </AsyncButton>
    </div>
  )
}

const LastCheckedSection: React.FC<{
  feed: FeedInfoCard_feed
}> = ({ feed }) => {
  const environment = useRelayEnvironment()
  const { setError, clearErrors } = useErrors()

  async function onClick(): Promise<void> {
    try {
      await refreshFeed(environment, feed.id)
      clearErrors()
    } catch (e) {
      setError(e)
    }
  }

  return (
    <InfoSection
      label={
        <>
          Checked{" "}
          <span className="font-medium text-primary-9">
            <Moment fromNow>{feed.refreshedAt}</Moment>
          </span>
        </>
      }
      buttonLabel={feed.refreshing ? "Checking…" : "Check now"}
      onClick={onClick}
    />
  )
}

const AutopostSection: React.FC<{
  feed: FeedInfoCard_feed
}> = ({ feed }) => {
  const environment = useRelayEnvironment()
  const { setError, clearErrors } = useErrors()

  async function onClick(): Promise<void> {
    try {
      await setFeedOptions(environment, {
        id: feed.id,
        autopost: !feed.autopost,
      })
      clearErrors()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <InfoSection
      label={
        <>
          Posting{" "}
          <span className="font-medium text-primary-9">
            {feed.autopost ? "every 5 minutes" : "manually"}
          </span>
        </>
      }
      buttonLabel={feed.autopost ? "Stop autoposting" : "Start autoposting"}
      onClick={onClick}
    />
  )
}

const micropubQuery = graphql`
  query FeedInfoCardEndpointsQuery($url: String!) {
    microformats(url: $url) {
      authorizationEndpoint
      tokenEndpoint
    }
  }
`

export const MicropubSection: React.FC<{
  feed: FeedInfoCard_feed
  user: FeedInfoCard_user
}> = ({ feed, user }) => {
  const environment = useRelayEnvironment()

  if (!feed.micropubEndpoint) {
    return null
  }

  const isMicropubAuthenticated = user.micropubSites.includes(
    feed.homePageURL.replace(/\./g, "-")
  )

  async function onClick(): Promise<void> {
    const variables = { url: feed.homePageURL }
    const { microformats } = await fetchQuery<FeedInfoCardEndpointsQuery>(
      environment,
      micropubQuery,
      variables
    )

    if (!microformats) {
      return
    }

    const { authorizationEndpoint, tokenEndpoint } = microformats
    if (authorizationEndpoint && tokenEndpoint) {
      beginIndieAuth({
        endpoint: authorizationEndpoint,
        tokenEndpoint,
        me: feed.homePageURL,
        scopes: "update",
      })
    }
  }

  return (
    <InfoSection
      label={
        isMicropubAuthenticated ? (
          <>Syndicating with Micropub</>
        ) : (
          <>Not syndicating with Micropub</>
        )
      }
      buttonLabel={
        isMicropubAuthenticated ? "Update syndication" : "Set up syndication"
      }
      onClick={onClick}
    />
  )
}
