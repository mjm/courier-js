import { Environment, fetchQuery, graphql } from "relay-runtime"

export interface TweetCanceledEvent {
  user_id: string
  tweet_id: string
}

const fetchTweetQuery = graphql`
  query TweetCanceledEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on Tweet {
        status
      }
    }
  }
`

export async function handleTweetCanceled(
  environment: Environment,
  event: TweetCanceledEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.tweet_id })
}
