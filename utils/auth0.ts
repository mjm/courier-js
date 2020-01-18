import Cookie from "js-cookie"
import jwtDecode from "jwt-decode"
import { IncomingMessage } from "http"

export function getUser(req?: IncomingMessage): any {
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
  req?: IncomingMessage,
  type: "idToken" | "accessToken" = "idToken"
): string | undefined {
  return getCookie(req, type)
}

export function isAuthenticated(req?: IncomingMessage): boolean {
  const expiresAtStr = getCookie(req, "expiresAt")
  if (!expiresAtStr) {
    return false
  }

  const expiresAt = parseInt(expiresAtStr, 10)
  return Date.now() < expiresAt
}

function getCookie(
  req: IncomingMessage | undefined,
  key: string
): string | undefined {
  if (req) {
    return getServerCookie(req, key)
  } else {
    return Cookie.get(key)
  }
}

function getServerCookie(
  req: IncomingMessage | undefined,
  key: string
): string | undefined {
  if (!req) {
    return undefined
  }

  if (!req.headers.cookie) {
    return undefined
  }

  const cookie = req.headers.cookie
    .split(";")
    .find(c => c.trim().startsWith(`${key}=`))
  if (!cookie) {
    return undefined
  }
  const [, value] = cookie.split("=")
  return value
}
