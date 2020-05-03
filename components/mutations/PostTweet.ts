import { Environment, graphql } from "react-relay"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation PostTweetMutation($input: PostTweetInput!) {
    postTweet(input: $input) {
      tweetGroup {
        id
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

interface PostTweetInput {
  id: string
  body?: string
  mediaURLs?: readonly string[]
}

export async function postTweet(
  environment: Environment,
  input: PostTweetInput
): Promise<void> {
  const variables = { input }
  await commitMutationAsync(environment, {
    mutation,
    variables,
  })
}
