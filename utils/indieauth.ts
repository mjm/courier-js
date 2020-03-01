import Cookie from "js-cookie"
import randomBytes from "randombytes"

function rootUrl(): string {
  return window.location.protocol + "//" + window.location.host + "/"
}

interface IndieAuthInit {
  endpoint: string
  tokenEndpoint: string
  // redirectURI: string
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
  me,
  scopes,
}: IndieAuthInit): void {
  const clientID = rootUrl()
  const redirectURI = process.env.INDIEAUTH_CALLBACK_URL
  if (!redirectURI) {
    throw new Error("No IndieAuth URL configured")
  }
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

function setStoredData(data: StoredData): void {
  Cookie.set("indieauth", data)
}
