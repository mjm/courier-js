import { graphql, Environment } from "react-relay"
import { ROOT_ID } from "relay-runtime"
import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation AddFeedMutation($input: AddFeedInput!) {
    addFeed(input: $input) {
      feedEdge {
        node {
          ...FeedCard_feed
        }
        cursor
      }
    }
  }
`

export async function addFeed(
  environment: Environment,
  url: string
): Promise<void> {
  const variables = { input: { url } }
  await commitMutationAsync(environment, {
    mutation,
    variables,
    configs: [
      {
        parentID: ROOT_ID,
        type: "RANGE_ADD",
        connectionInfo: [
          {
            key: "FeedList_allSubscribedFeeds",
            rangeBehavior: "append",
          },
        ],
        edgeName: "feedEdge",
      },
    ],
  })
}
