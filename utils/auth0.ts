import auth0, { Auth0DecodedHash } from "auth0-js"
import Cookie from "js-cookie"
import jwtDecode from "jwt-decode"
import Router from "next/router"

const client = new auth0.WebAuth({
  clientID: process.env.CLIENT_ID || "",
  domain: process.env.AUTH_DOMAIN || "",
  responseType: "token id_token",
  redirectUri: `${getBaseUrl()}/logged-in`,
  scope: "openid profile email",
  audience: process.env.API_IDENTIFIER,
})

let tokenRenewalTimeout: any

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return `${window.location.protocol}//${window.location.host}`
}

export const authorize = client.authorize.bind(client)
export const parseHash = client.parseHash.bind(client)

export function setToken(result: Auth0DecodedHash) {
  if (typeof window === "undefined") {
    return
  }

  Cookie.set("user", jwtDecode(result.idToken!))
  Cookie.set("idToken", result.idToken!)
  Cookie.set("accessToken", result.accessToken!)

  const expiresAt = result.expiresIn! * 1000 + Date.now()
  Cookie.set("expiresAt", `${expiresAt}`)

  scheduleRenewal(expiresAt)
}

function scheduleRenewal(expiresAt: number) {
  const timeout = expiresAt - Date.now()
  if (timeout > 0) {
    tokenRenewalTimeout = setTimeout(renewSession, timeout)
  }
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

export function getToken(
  req: any,
  type: "idToken" | "accessToken" = "idToken"
): string | undefined {
  return getCookie(req, type)
}

export async function renewSession(): Promise<void> {
  return new Promise((resolve, reject) => {
    client.checkSession({}, (err, result) => {
      if (err) {
        logout()
        console.error(err)
        reject(err)
      } else if (result) {
        setToken(result)
        resolve()
      }
    })
  })
}

export function isAuthenticated(req?: any): boolean {
  const expiresAtStr = getCookie(req, "expiresAt")
  if (!expiresAtStr) {
    return false
  }

  const expiresAt = parseInt(expiresAtStr, 10)
  return Date.now() < expiresAt
}

export function logout() {
  Cookie.remove("user")
  Cookie.remove("idToken")
  Cookie.remove("accessToken")
  Cookie.remove("expiresAt")

  clearTimeout(tokenRenewalTimeout)
  client.logout({ returnTo: window.location.origin })

  Router.push("/")
}

function getCookie(req: any, key: string): string | undefined {
  if (req) {
    return getServerCookie(req, key)
  } else {
    return Cookie.get(key)
  }
}

function getServerCookie(req: any, key: string): string | undefined {
  if (!req) {
    return undefined
  }

  if (!req.headers.cookie) {
    return undefined
  }

  const cookie = (req.headers.cookie as string)
    .split(";")
    .find(c => c.trim().startsWith(`${key}=`))
  if (!cookie) {
    return undefined
  }
  const [, value] = cookie.split("=")
  return value
}
