import { Environment,graphql } from "react-relay"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation SubscribeMutation($input: SubscribeInput!) {
    subscribe(input: $input) {
      user {
        customer {
          creditCard {
            brand
            lastFour
            expirationMonth
            expirationYear
          }
        }
        subscription {
          status
          periodEnd
        }
      }
    }
  }
`

export interface SubscribeInput {
  tokenID: string
  email: string
}

export async function subscribe(
  environment: Environment,
  input?: SubscribeInput
): Promise<void> {
  const variables = { input: input ?? {} }
  await commitMutationAsync(environment, {
    mutation,
    variables,
  })
}
