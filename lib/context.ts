import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"

export interface CourierContext {
  getUser: () => Promise<any>
}

const context: ContextFunction<any, CourierContext> = ({ req }) => {
  const token = getToken(req.headers)

  return {
    async getUser(): Promise<any> {
      return await verify(token)
    },
  }
}

export default context
