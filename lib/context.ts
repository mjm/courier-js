import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"

const context: ContextFunction = ({ req }) => {
  const token = getToken(req.headers)

  return {
    async getUser(): Promise<any> {
      return await verify(token)
    },
  }
}

export default context
