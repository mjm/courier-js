import { graphql, Environment, commitMutation } from "react-relay"
import { EditTweetMutationResponse } from "../../lib/__generated__/EditTweetMutation.graphql"

const mutation = graphql`
  mutation EditTweetMutation($input: EditTweetInput!) {
    editTweet(input: $input) {
      tweet {
        id
        body
        mediaURLs
      }
    }
  }
`

interface EditTweetInput {
  id: string
  body: string
  mediaURLs: readonly string[]
}

function getOptimisticResponse(
  input: EditTweetInput
): EditTweetMutationResponse {
  return {
    editTweet: {
      tweet: {
        ...input,
      },
    },
  }
}

export function editTweet(environment: Environment, input: EditTweetInput) {
  const variables = { input }

  commitMutation(environment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(input),
  })
}
