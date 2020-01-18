import { graphql, commitMutation, Environment } from "react-relay"
import { CancelTweetMutationResponse } from "@generated/CancelTweetMutation.graphql"

const mutation = graphql`
  mutation CancelTweetMutation($input: CancelTweetInput!) {
    cancelTweet(input: $input) {
      tweet {
        id
        status
      }
    }
  }
`

function getOptimisticResponse(id: string): CancelTweetMutationResponse {
  return {
    cancelTweet: {
      tweet: {
        id,
        status: "CANCELED",
      },
    },
  }
}

export function cancelTweet(environment: Environment, id: string) {
  const variables = { input: { id } }

  commitMutation(environment, {
    mutation,
    variables,
    optimisticResponse: getOptimisticResponse(id),
    // TODO add update config to move this to the other range
  })
}
