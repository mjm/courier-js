import { Environment, fetchQuery, graphql } from "relay-runtime"

import { createEventHook } from "components/EventsProvider"

export interface FeedRefreshedEvent {
  user_id: string
  feed_id: string
}

const fetchFeedQuery = graphql`
  query FeedRefreshedEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on Feed {
        title
        homePageURL
        micropubEndpoint
        refreshedAt
      }
    }
  }
`

export async function handleFeedRefreshed(
  environment: Environment,
  event: FeedRefreshedEvent
): Promise<void> {
  await fetchQuery(environment, fetchFeedQuery, { id: event.feed_id })
}

export const useFeedRefreshedEvent = createEventHook(
  "FeedRefreshed",
  handleFeedRefreshed
)
