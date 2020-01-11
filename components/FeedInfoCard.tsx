import { faClone } from "@fortawesome/free-solid-svg-icons"
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
import { Button } from "./Button"
import AsyncButton from "components/AsyncButton"
import Moment from "react-moment"
import { refreshFeed } from "@mutations/RefreshFeed"
import { useErrors } from "components/ErrorContainer"

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
  const { setError, clearErrors } = useErrors()
  const isMicropubAuthenticated = user.micropubSites.includes(
    feed.feed.homePageURL.replace(/\./g, "-")
  )

  return (
    <div className="rounded-lg shadow-md bg-neutral-1 p-4">
      <InfoSection
        label={
          <>
            Checked{" "}
            <span className="font-medium text-primary-9">
              <Moment fromNow>{feed.feed.refreshedAt}</Moment>
            </span>
          </>
        }
        buttonLabel="Check now"
        onClick={async () => {
          try {
            await refreshFeed(environment, feed.feed.id)
            clearErrors()
          } catch (e) {
            setError(e)
          }
        }}
      />
      <InfoSection
        className="mt-4"
        label={
          <>
            Posting{" "}
            <span className="font-medium text-primary-9">
              {feed.autopost ? "every 5 minutes" : "manually"}
            </span>
          </>
        }
        buttonLabel={feed.autopost ? "Stop autoposting" : "Start autoposting"}
        onClick={async () => {}}
      />
      {feed.feed.micropubEndpoint ? (
        <InfoSection
          className="mt-4"
          label={
            isMicropubAuthenticated ? (
              <>Syndicating with Micropub</>
            ) : (
              <>Not syncidating with Micropub</>
            )
          }
          buttonLabel={
            isMicropubAuthenticated
              ? "Update syndication"
              : "Set up syndication"
          }
          onClick={async () => {}}
        />
      ) : null}
    </div>
  )
}

export default createFragmentContainer(FeedInfoCard, {
  feed: graphql`
    fragment FeedInfoCard_feed on SubscribedFeed {
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

interface InfoSectionProps {
  className?: string
  label: React.ReactNode
  buttonLabel: string
  onClick: () => Promise<void>
}

const InfoSection: React.FC<InfoSectionProps> = ({
  className,
  label,
  buttonLabel,
  onClick,
}) => {
  return (
    <div className={`${className || ""}`}>
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

interface MicropubAuthButtonProps {
  environment: Environment
  homePageURL: string
}

const micropubQuery = graphql`
  query FeedInfoCardEndpointsQuery($url: String!) {
    microformats(url: $url) {
      authorizationEndpoint
      tokenEndpoint
    }
  }
`

export const MicropubAuthButton: React.FC<MicropubAuthButtonProps> = ({
  environment,
  homePageURL,
}) => {
  async function onClick() {
    const variables = { url: homePageURL }
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
        me: homePageURL,
        scopes: "update",
      })
    }
  }

  return (
    <Button icon={faClone} mt={3} onClickAsync={onClick}>
      Set Up Syndication
    </Button>
  )
}
