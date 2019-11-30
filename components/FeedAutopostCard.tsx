import Card, { CardHeader } from "./Card"
import {
  createFragmentContainer,
  graphql,
  Environment,
  RelayProp,
} from "react-relay"
import { FeedAutopostCard_feed } from "../lib/__generated__/FeedAutopostCard_feed.graphql"
import { Button } from "./Button"
import { useErrors } from "./ErrorContainer"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { setFeedOptions } from "./mutations/SetFeedOptions"

interface Props {
  feed: FeedAutopostCard_feed
  relay: RelayProp
}

const FeedAutopostCard: React.FC<Props> = ({
  feed,
  relay: { environment },
}) => {
  return (
    <Card>
      <CardHeader>Autoposting</CardHeader>
      {feed.autopost ? (
        <div>
          Courier is importing tweets from this feed and{" "}
          <strong>will post them to Twitter automatically.</strong>
        </div>
      ) : (
        <div>
          Courier is importing tweets from this feed, but they{" "}
          <strong>will not be posted automatically.</strong>
        </div>
      )}
      <AutopostButton environment={environment} feed={feed} />
    </Card>
  )
}

export default createFragmentContainer(FeedAutopostCard, {
  feed: graphql`
    fragment FeedAutopostCard_feed on SubscribedFeed {
      id
      autopost
    }
  `,
})

interface AutopostButtonProps {
  feed: FeedAutopostCard_feed
  environment: Environment
}

const AutopostButton: React.FC<AutopostButtonProps> = ({
  feed,
  environment,
}) => {
  const { setError, clearErrors } = useErrors()

  return (
    <Button
      mt={3}
      icon={faTwitter}
      onClickAsync={async () => {
        try {
          await setFeedOptions(environment, {
            id: feed.id,
            autopost: !feed.autopost,
          })
          clearErrors()
        } catch (err) {
          setError(err)
        }
      }}
    >
      Turn {feed.autopost ? "Off" : "On"} Autoposting
    </Button>
  )
}
