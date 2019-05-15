import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"
import { UserToken } from "./data/types"

export interface CourierContext {
  token: string | null
  getUser: () => Promise<UserToken>
}

const context: ContextFunction<any, CourierContext> = ({ req }) => {
  const token = getToken(req.headers)

  return {
    token,
    async getUser(): Promise<any> {
      return await verify(token)
    },
  }
}

export default context
