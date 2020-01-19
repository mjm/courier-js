import { Environment,graphql } from "react-relay"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation RefreshFeedMutation($input: RefreshFeedInput!) {
    refreshFeed(input: $input) {
      feed {
        id
        title
        homePageURL
        refreshedAt
      }
    }
  }
`

export async function refreshFeed(
  environment: Environment,
  id: string
): Promise<void> {
  const variables = { input: { id } }
  await commitMutationAsync(environment, {
    mutation,
    variables,
  })
}
