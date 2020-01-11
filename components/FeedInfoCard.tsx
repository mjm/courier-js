import {
  createFragmentContainer,
  graphql,
  RelayProp,
  Environment,
  fetchQuery,
} from "react-relay"
import { FeedInfoCard_feed } from "@generated/FeedInfoCard_feed.graphql"
import { FeedInfoCard_user } from "@generated/FeedInfoCard_user.graphql"
import { FeedInfoCardEndpointsQuery } from "@generated/FeedInfoCardEndpointsQuery.graphql"
import { beginIndieAuth } from "utils/indieauth"
import AsyncButton from "components/AsyncButton"
import Moment from "react-moment"
import { refreshFeed } from "@mutations/RefreshFeed"
import { useErrors } from "components/ErrorContainer"
import { setFeedOptions } from "@mutations/SetFeedOptions"

interface Props {
  feed: FeedInfoCard_feed
  user: FeedInfoCard_user
  relay: RelayProp
}

const FeedInfoCard: React.FC<Props> = ({
  feed,
  user,
  relay: { environment },
}) => {
  return (
    <div className="rounded-lg shadow-md bg-neutral-1 p-4">
      <div className="flex flex-wrap -mx-4 -mb-4">
        <LastCheckedSection feed={feed.feed} environment={environment} />
        <AutopostSection feed={feed} environment={environment} />
        <MicropubSection
          feed={feed.feed}
          user={user}
          environment={environment}
        />
      </div>
    </div>
  )
}

export default createFragmentContainer(FeedInfoCard, {
  feed: graphql`
    fragment FeedInfoCard_feed on SubscribedFeed {
      id
      feed {
        id
        url
        homePageURL
        micropubEndpoint
        refreshedAt
      }
      autopost
    }
  `,
  user: graphql`
    fragment FeedInfoCard_user on User {
      micropubSites
    }
  `,
})

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
  feed: FeedInfoCard_feed["feed"]
  environment: Environment
}> = ({ feed, environment }) => {
  const { setError, clearErrors } = useErrors()

  async function onClick() {
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
      buttonLabel="Check now"
      onClick={onClick}
    />
  )
}

const AutopostSection: React.FC<{
  feed: FeedInfoCard_feed
  environment: Environment
}> = ({ feed, environment }) => {
  const { setError, clearErrors } = useErrors()

  async function onClick() {
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
  feed: FeedInfoCard_feed["feed"]
  user: FeedInfoCard_user
  environment: Environment
}> = ({ feed, user, environment }) => {
  if (!feed.micropubEndpoint) {
    return null
  }

  const isMicropubAuthenticated = user.micropubSites.includes(
    feed.homePageURL.replace(/\./g, "-")
  )

  async function onClick() {
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
        redirectURI: "api/syndication-callback",
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
          <>Not syncidating with Micropub</>
        )
      }
      buttonLabel={
        isMicropubAuthenticated ? "Update syndication" : "Set up syndication"
      }
      onClick={onClick}
    />
  )
}
