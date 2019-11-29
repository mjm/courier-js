import { graphql, Environment, commitMutation } from "react-relay"
import { ROOT_ID } from "relay-runtime"

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

export function addFeed(environment: Environment, url: string): Promise<void> {
  const variables = { input: { url } }
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted(_res, errors) {
        if (errors && errors.length) {
          reject(errors[0])
        } else {
          resolve()
        }
      },
      onError(err) {
        reject(err)
      },
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
  })
}
