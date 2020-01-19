import { commitMutation,Environment, graphql } from "react-relay"

import { UncancelTweetMutationResponse } from "@generated/UncancelTweetMutation.graphql"

const mutation = graphql`
  mutation UncancelTweetMutation($input: UncancelTweetInput!) {
    uncancelTweet(input: $input) {
      tweet {
        id
        status
      }
    }
  }
`

function getOptimisticResponse(id: string): UncancelTweetMutationResponse {
  return {
    uncancelTweet: {
      tweet: {
        id,
        status: "DRAFT",
      },
    },
  }
}

export function uncancelTweet(environment: Environment, id: string): void {
  const variables = { input: { id } }

  commitMutation(environment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(id),
    // TODO add update config to move this to the other range
  })
}
