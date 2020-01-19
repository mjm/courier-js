import { Environment,graphql } from "react-relay"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation SetFeedOptionsMutation($input: SetFeedOptionsInput!) {
    setFeedOptions(input: $input) {
      feed {
        id
        autopost
      }
    }
  }
`

export interface SetFeedOptionsInput {
  id: string
  autopost: boolean
}

export async function setFeedOptions(
  environment: Environment,
  input: SetFeedOptionsInput
): Promise<void> {
  const variables = { input }
  await commitMutationAsync(environment, {
    mutation,
    variables,
  })
}
