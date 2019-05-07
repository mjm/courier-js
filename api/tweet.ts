import * as auth0 from "auth0"
import micro, { RequestHandler } from "../lib/micro"
import { getToken, verify } from "../lib/auth"

const client = new auth0.ManagementClient({
  domain: process.env.AUTH_DOMAIN || "",
  clientId: process.env.BACKEND_CLIENT_ID,
  clientSecret: process.env.BACKEND_CLIENT_SECRET,
  scope: "read:users read:user_idp_tokens",
})

const handler: RequestHandler = async (req, _res) => {
  const token = getToken(req.headers)
  const { sub } = await verify(token)

  const profile = await client.getUser({ id: sub })
  return profile
}

export default micro(handler)
