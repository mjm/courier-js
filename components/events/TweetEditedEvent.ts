import { Environment, fetchQuery, graphql } from "relay-runtime"

import { createEventHook } from "components/EventsProvider"

export interface TweetEditedEvent {
  user_id: string
  item_id: string
}

const fetchTweetQuery = graphql`
  query TweetEditedEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on TweetGroup {
        tweets {
          body
          mediaURLs
        }
      }
    }
  }
`

export async function handleTweetEdited(
  environment: Environment,
  event: TweetEditedEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.item_id })
}

export const useTweetEditedEvent = createEventHook(
  "TweetEdited",
  handleTweetEdited
)
