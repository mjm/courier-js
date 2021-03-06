import { Environment, graphql } from "react-relay"
import { ROOT_ID } from "relay-runtime"

import { AddFeedMutation } from "@generated/AddFeedMutation.graphql"
import { commitMutationAsync } from "@mutations/commitMutationAsync"

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
        parentID: `${ROOT_ID}:viewer`,
        type: "RANGE_ADD",
        connectionInfo: [
          {
            key: "FeedList_allFeeds",
            rangeBehavior: "append",
          },
        ],
        edgeName: "feedEdge",
      },
    ],
  })
  return result.addFeed.feed.id
}
