import { Environment, fetchQuery, graphql } from "relay-runtime"

import { createEventHook } from "components/EventsProvider"

export interface TweetPostedEvent {
  user_id: string
  item_id: string
  autoposted: boolean
}

const fetchTweetQuery = graphql`
  query TweetPostedEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on TweetGroup {
        tweets {
          body
          mediaURLs
          postedTweetID
        }
        status
        postedAt
        postAfter
      }
    }
  }
`

export async function handleTweetPosted(
  environment: Environment,
  event: TweetPostedEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.item_id })
}

export const useTweetPostedEvent = createEventHook(
  "TweetPosted",
  handleTweetPosted
)
