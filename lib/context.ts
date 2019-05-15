import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"
import { UserToken } from "./data/types"
import { Loaders, createLoaders } from "./loaders"

export interface CourierContext {
  token: string | null
  getUser: () => Promise<UserToken>
  loaders: Loaders
}

const context: ContextFunction<any, CourierContext> = ({ req }) => {
  const token = getToken(req.headers)

  return {
    token,
    async getUser(): Promise<any> {
      return await verify(token)
    },
    loaders: createLoaders(),
  }
}

export default context
