import { Environment } from "react-relay"
import {
  commitMutation,
  MutationConfig,
  MutationParameters,
} from "relay-runtime"

type AsyncMutationConfig<TOperation extends MutationParameters> = Omit<
  MutationConfig<TOperation>,
  "onError" | "onCompleted"
>

export function commitMutationAsync<
  TOperation extends MutationParameters = MutationParameters
>(
  environment: Environment,
  config: AsyncMutationConfig<TOperation>
): Promise<TOperation["response"]> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      ...config,
      onCompleted(res, errors) {
        if (errors && errors.length) {
          reject(errors[0])
        } else {
          resolve(res)
        }
      },
      onError(err) {
        reject(err)
      },
    })
  })
}
