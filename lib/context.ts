import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"
import { UserToken, UserId } from "./data/types"
import { Loaders, createLoaders } from "./loaders"

export interface CourierContext {
  token: string | null
  getUser: () => Promise<UserToken>
  loaders: Loaders
}

const context: ContextFunction<any, CourierContext> = async ({ req }) => {
  const token = getToken(req.headers)
  const verifyPromise: Promise<UserToken> = verify(token)

  let userId: UserId | null = null
  try {
    const { sub } = await verifyPromise
    userId = sub
  } catch (e) {
    // let this fail silently here
    // if resolvers need there to be a valid user, they will bubble the error
  }

  return {
    token,
    async getUser() {
      return verifyPromise
    },
    loaders: createLoaders(userId),
  }
}

export default context
