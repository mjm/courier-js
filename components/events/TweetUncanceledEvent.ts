import { Environment, fetchQuery, graphql } from "relay-runtime"

export interface TweetUncanceledEvent {
  user_id: string
  tweet_id: string
}

const fetchTweetQuery = graphql`
  query TweetUncanceledEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on Tweet {
        status
      }
    }
  }
`

export async function handleTweetUncanceled(
  environment: Environment,
  event: TweetUncanceledEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.tweet_id })
}