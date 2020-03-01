import { Environment, fetchQuery, graphql } from "relay-runtime"

export interface TweetPostedEvent {
  user_id: string
  tweet_id: string
  autoposted: boolean
}

const fetchTweetQuery = graphql`
  query TweetPostedEventQuery($id: ID!) {
    node(id: $id) {
      id
      ... on Tweet {
        status
        postedAt
        postedTweetID
        postAfter
      }
    }
  }
`

export async function handleTweetPosted(
  environment: Environment,
  event: TweetPostedEvent
): Promise<void> {
  await fetchQuery(environment, fetchTweetQuery, { id: event.tweet_id })
}
