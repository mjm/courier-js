const rootUrl = window.location.protocol + "//" + window.location.host + "/"

interface IndieAuthInit {
  endpoint: string
  redirectURI: string
  me: string
  scopes: string
}

export function beginIndieAuth({
  endpoint,
  redirectURI,
  me,
  scopes,
}: IndieAuthInit): void {
  const params = new URLSearchParams()
  params.set("me", me)
  params.set("scope", scopes)
  params.set("client_id", rootUrl)
  params.set("redirect_uri", rootUrl + redirectURI)
  params.set("state", "foo") // TODO generate a random string and store in sessionStorage
  params.set("response_type", "code")
  const url = `${endpoint}?${params.toString()}`

  window.location.href = url
}
