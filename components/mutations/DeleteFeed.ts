import { Environment, graphql } from "react-relay"
import { ROOT_ID } from "relay-runtime"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation DeleteFeedMutation($input: DeleteFeedInput!) {
    deleteFeed(input: $input) {
      id
    }
  }
`

export async function deleteFeed(
  environment: Environment,
  id: string
): Promise<void> {
  const variables = { input: { id } }
  await commitMutationAsync(environment, {
    mutation,
    variables,
    configs: [
      {
        type: "RANGE_DELETE",
        parentID: ROOT_ID,
        connectionKeys: [{ key: "FeedList_allFeeds" }],
        pathToConnection: ["viewer", "allFeeds"],
        deletedIDFieldName: "id",
      },
    ],
  })
}
