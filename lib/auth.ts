import { UserId } from "./data/types"
import { ManagementClient } from "auth0"

const managementClient = new ManagementClient({
  domain: process.env.AUTH_DOMAIN || "",
  clientId: process.env.BACKEND_CLIENT_ID,
  clientSecret: process.env.BACKEND_CLIENT_SECRET,
  scope: "read:users read:user_idp_tokens",
})

export interface TwitterCredentials {
  access_token: string
  access_token_secret: string
}

export async function getTwitterCredentials(
  userId: UserId
): Promise<TwitterCredentials> {
  const user = await managementClient.getUser({ id: userId })
  const twitterIdentity = (user.identities || []).find(
    ident => ident.provider === "twitter"
  )
  if (!twitterIdentity) {
    throw new Error(`User ${userId} does not have a Twitter identity.`)
  }

  return {
    access_token: twitterIdentity.access_token!,
    // I guess this isn't a universal property, because Auth0 doesn't have it
    // declared in their types.
    // @ts-ignore
    access_token_secret: twitterIdentity.access_token_secret,
  }
}
