import { withData } from "next-apollo"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import url from "./url"
import { NextContext } from "next"
import { getToken } from "../utils/auth0"

const config = (ctx: NextContext) => {
  const req = ctx && ctx.req
  const authLink = setContext((_, { headers }) => {
    const token = getToken(req, "accessToken")
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })

  const httpLink = new HttpLink({
    uri: url("/graphql", req),
  })

  return {
    link: authLink.concat(httpLink),
  }
}

export default withData(config)
