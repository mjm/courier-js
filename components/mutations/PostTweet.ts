import { graphql, Environment } from "react-relay"
import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation PostTweetMutation($input: PostTweetInput!) {
    postTweet(input: $input) {
      tweet {
        id
        body
        mediaURLs
        status
        postedAt
        postedTweetID
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
