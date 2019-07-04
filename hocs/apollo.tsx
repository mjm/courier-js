import { withData } from "next-apollo"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { NextContext } from "next"
import { getToken } from "../utils/auth0"
import { IncomingMessage } from "http"

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
    uri: apiUrl("/graphql", req),
  })

  return {
    link: authLink.concat(httpLink),
  }
}

export default withData(config)

function apiUrl(path: string, req: IncomingMessage | undefined) {
  if (req && typeof window === "undefined") {
    // this is running server-side, so we need an absolute URL
    const host = req.headers.host
    if (host && host.startsWith("localhost")) {
      return `http://localhost:3000${path}`
    } else {
      return `https://${host}${path}`
    }
  } else {
    // this is running client-side, so a relative path is fine
    return path
  }
}
