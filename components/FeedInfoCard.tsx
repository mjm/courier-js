import Card from "./card"
import { InfoField } from "./info"
import URL from "./url"
import Icon from "./icon"
import {
  faCheckCircle,
  faTimesCircle,
  faClone,
} from "@fortawesome/free-solid-svg-icons"
import {
  createFragmentContainer,
  graphql,
  RelayProp,
  Environment,
  fetchQuery,
} from "react-relay"
import { FeedInfoCard_feed } from "../lib/__generated__/FeedInfoCard_feed.graphql"
import { FeedInfoCard_user } from "../lib/__generated__/FeedInfoCard_user.graphql"
import { FeedInfoCardEndpointsQuery } from "../lib/__generated__/FeedInfoCardEndpointsQuery.graphql"
import { beginIndieAuth } from "../utils/indieauth"
import { Button } from "./button"

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
  const isMicropubAuthenticated = user.micropubSites.includes(
    feed.homePageURL.replace(/\./g, "-")
  )

  return (
    <Card>
      <InfoField label="Feed URL">
        <a href={feed.url}>
          <URL>{feed.url}</URL>
        </a>
      </InfoField>
      <InfoField label="Home Page">
        <a href={feed.homePageURL}>
          <URL>{feed.homePageURL}</URL>
        </a>
      </InfoField>
      {feed.micropubEndpoint ? (
        <>
          <InfoField label="Micropub API">
            <URL>
              {feed.micropubEndpoint}
              {isMicropubAuthenticated ? (
                <Icon
                  ml={2}
                  icon={faCheckCircle}
                  color="primary.600"
                  title="You are set up to post back syndication links to this site."
                />
              ) : (
                <Icon
                  ml={2}
                  icon={faTimesCircle}
                  color="gray.500"
                  title="You are not posting syndication links back to this site."
                />
              )}
            </URL>
          </InfoField>
          <MicropubAuthButton
            environment={environment}
            homePageURL={feed.homePageURL}
          />
        </>
      ) : null}
    </Card>
  )
}

export default createFragmentContainer(FeedInfoCard, {
  feed: graphql`
    fragment FeedInfoCard_feed on Feed {
      url
      homePageURL
      micropubEndpoint
    }
  `,
  user: graphql`
    fragment FeedInfoCard_user on User {
      micropubSites
    }
  `,
})

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

const MicropubAuthButton: React.FC<MicropubAuthButtonProps> = ({
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
