import { graphql, Environment, commitMutation } from "react-relay"

const mutation = graphql`
  mutation PostTweetMutation($input: PostTweetInput!) {
    postTweet(input: $input) {
      tweet {
        id
        body
        mediaURLs
        status
        postedAt
        postedTweetID
      }
    }
  }
`

interface PostTweetInput {
  id: string
  body?: string
  mediaURLs?: readonly string[]
}

export function postTweet(
  environment: Environment,
  input: PostTweetInput
): Promise<void> {
  const variables = { input }
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
    })
  })
}
