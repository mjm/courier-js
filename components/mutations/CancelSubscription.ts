import { Environment,graphql } from "react-relay"
import { ROOT_ID } from "relay-runtime"

import { commitMutationAsync } from "./commitMutationAsync"

const mutation = graphql`
  mutation CancelSubscriptionMutation($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      user {
        subscription {
          status
        }
      }
    }
  }
`

export async function cancelSubscription(
  environment: Environment
): Promise<void> {
  await commitMutationAsync(environment, {
    mutation,
    variables: { input: {} },
    updater(store) {
      // It would probably be much easier to give these an ID
      const newStatus = store
        .getRootField("cancelSubscription")
        ?.getLinkedRecord("user")
        ?.getLinkedRecord("subscription")
        ?.getValue("status")

      const currentUser = store.get(ROOT_ID)?.getLinkedRecord("currentUser")
      const subscription = currentUser?.getLinkedRecord("subscription")
      subscription?.setValue(newStatus, "status")
    },
  })
}
