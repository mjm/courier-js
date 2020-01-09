import { graphql, Environment } from "react-relay"
import { ROOT_ID } from "relay-runtime"
import { commitMutationAsync } from "./commitMutationAsync"
import { AddFeedMutation } from "@generated/AddFeedMutation.graphql"

const mutation = graphql`
  mutation AddFeedMutation($input: AddFeedInput!) {
    addFeed(input: $input) {
      feed {
        id
      }
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
): Promise<string> {
  const variables = { input: { url } }
  const result = await commitMutationAsync<AddFeedMutation>(environment, {
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
  return result.addFeed.feed.id
}
