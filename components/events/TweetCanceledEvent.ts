import { Environment, fetchQuery, graphql } from "relay-runtime"

import { createEventHook } from "components/EventsProvider"

export interface TweetCanceledEvent {
  user_id: string
  item_id: string
}

const fetchTweetQuery = graphql`
  query TweetCanceledEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on TweetGroup {
        status
      }
    }
  }
`

export async function handleTweetCanceled(
  environment: Environment,
  event: TweetCanceledEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.item_id })
}

export const useTweetCanceledEvent = createEventHook(
  "TweetCanceled",
  handleTweetCanceled
)
