import { Environment, fetchQuery, graphql } from "relay-runtime"
import { createEventHook } from "components/EventsProvider"

export interface FeedOptionsChangedEvent {
  user_id: string
  feed_subscription_id: string
  autopost: boolean
}

const fetchFeedQuery = graphql`
  query FeedOptionsChangedEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on SubscribedFeed {
        autopost
      }
    }
  }
`

export async function handleFeedOptionsChanged(
  environment: Environment,
  event: FeedOptionsChangedEvent
): Promise<void> {
  await fetchQuery(environment, fetchFeedQuery, {
    id: event.feed_subscription_id,
  })
}

export const useFeedOptionsChangedEvent = createEventHook(
  "FeedOptionsChanged",
  handleFeedOptionsChanged
)
