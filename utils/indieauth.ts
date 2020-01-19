import randomBytes from "randombytes"
import Cookie from "js-cookie"
import { NextApiRequest } from "next"
import fetch from "isomorphic-unfetch"
import { URLSearchParams } from "url"

function rootUrl(): string {
  return window.location.protocol + "//" + window.location.host + "/"
}

interface IndieAuthInit {
  endpoint: string
  tokenEndpoint: string
  redirectURI: string
  me: string
  scopes: string
}

interface StoredData {
  tokenEndpoint: string
  nonce: string
  me: string
  clientID: string
  redirectURI: string
  origin: string
}

// This function will only work correctly from the client
export function beginIndieAuth({
  endpoint,
  tokenEndpoint,
  redirectURI,
  me,
  scopes,
}: IndieAuthInit): void {
  const clientID = rootUrl()
  redirectURI = clientID + redirectURI
  const nonce = randomBytes(16).toString("hex")
  const origin = window.location.href

  setStoredData({ tokenEndpoint, nonce, me, clientID, redirectURI, origin })

  const params = new window.URLSearchParams()
  params.set("me", me)
  params.set("scope", scopes)
  params.set("client_id", clientID)
  params.set("redirect_uri", redirectURI)
  params.set("state", nonce)
  params.set("response_type", "code")
  const url = `${endpoint}?${params.toString()}`

  window.location.href = url
}

interface IndieAuthResult {
  origin: string
  url: string
  token: string
}

// This function will probably only work correctly from the server.
//
// It should be used either in an API route or in getInitialProps
export async function completeIndieAuth(
  req: NextApiRequest
): Promise<IndieAuthResult> {
  const {
    tokenEndpoint,
    nonce,
    me,
    clientID,
    redirectURI,
    origin,
  } = getStoredData(req)
  const { code, state } = req.query
  if (typeof code !== "string" || typeof state !== "string") {
    throw new Error("Invalid callback request")
  }

  if (state !== nonce) {
    throw new Error("This login attempt is stale. Start over and try again.")
  }

  const params = new URLSearchParams()
  params.set("grant_type", "authorization_code")
  params.set("code", code)
  params.set("client_id", clientID)
  params.set("redirect_uri", redirectURI)
  params.set("me", me)

  const response = await fetch(`${tokenEndpoint}?${params.toString()}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
  const tokenResponse = await response.json()
  return {
    origin,
    token: tokenResponse.access_token,
    url: me,
  }
}

function setStoredData(data: StoredData): void {
  Cookie.set("indieauth", data)
}

function getStoredData(req: NextApiRequest): StoredData {
  const storedStr = req.cookies.indieauth
  if (!storedStr) {
    throw new Error("This login attempt is stale. Start over and try again.")
  }

  return JSON.parse(storedStr) as StoredData
}
