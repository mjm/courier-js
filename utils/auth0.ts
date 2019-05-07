import auth0, { AuthorizeOptions } from "auth0-js"
import Cookie from "js-cookie"
import jwtDecode from "jwt-decode"

const client = new auth0.WebAuth({
  clientID: process.env.CLIENT_ID || "",
  domain: process.env.AUTH_DOMAIN || "",
})

function getBaseUrl(): string {
  return `${window.location.protocol}//${window.location.host}`
}

function getOptions(): AuthorizeOptions {
  return {
    responseType: "token id_token",
    redirectUri: `${getBaseUrl()}/logged-in`,
    scope: "openid profile email",
  }
}

export function authorize() {
  client.authorize(getOptions())
}

export const parseHash = client.parseHash.bind(client)

export function setToken(idToken: string, accessToken: string) {
  if (typeof window === "undefined") {
    return
  }

  Cookie.set("user", jwtDecode(idToken))
  Cookie.set("idToken", idToken)
  Cookie.set("accessToken", accessToken)
}

export function getUser(req: any): any {
  if (req) {
    const jwt = getToken(req)
    if (!jwt) {
      return undefined
    }
    return jwtDecode(jwt)
  } else {
    return Cookie.getJSON("user")
  }
}

export function getToken(req: any): string | undefined {
  if (req) {
    if (!req.headers.cookie) {
      return undefined
    }
    const jwtCookie = (req.headers.cookie as string)
      .split(";")
      .find(c => c.trim().startsWith("idToken="))
    if (!jwtCookie) {
      return undefined
    }
    const [, jwt] = jwtCookie.split("=")
    return jwt
  } else {
    return Cookie.getJSON("idToken")
  }
}
