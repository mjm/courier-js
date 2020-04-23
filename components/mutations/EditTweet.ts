import { commitMutation, Environment, graphql } from "react-relay"

import { EditTweetMutationResponse } from "@generated/EditTweetMutation.graphql"

const mutation = graphql`
  mutation EditTweetMutation($input: EditTweetInput!) {
    editTweet(input: $input) {
      tweetGroup {
        id
        tweets {
          body
          mediaURLs
        }
      }
    }
  }
`

interface EditTweetInput {
  id: string
  tweets: {
    body: string
    mediaURLs: readonly string[]
  }[]
}

function getOptimisticResponse(
  input: EditTweetInput
): EditTweetMutationResponse {
  return {
    editTweet: {
      tweetGroup: {
        ...input,
      },
    },
  }
}

export function editTweet(
  environment: Environment,
  input: EditTweetInput
): void {
  const variables = { input }

  commitMutation(environment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(input),
  })
}
