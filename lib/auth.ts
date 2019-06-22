import jwksClient from "@mmoriarity/jwks-rsa"
import * as jwt from "jsonwebtoken"
import { AuthenticationError } from "apollo-server-core"
import { IncomingHttpHeaders } from "http"
import { UserInfo, UserId } from "./data/types"
import { AuthenticationClient, ManagementClient } from "auth0"

export function getToken(headers: IncomingHttpHeaders): string | null {
  const authz = headers.authorization
  if (!authz) {
    return null
  }

  if (!authz.startsWith("Bearer ")) {
    return null
  }

  return authz.substring(7)
}

const jwtOptions: jwt.VerifyOptions = {
  audience: process.env.API_IDENTIFIER,
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ["RS256"],
}

export async function verify(token: string | null): Promise<any> {
  if (!token) {
    throw new AuthenticationError(
      "No token was provided in Authorization header"
    )
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, jwtOptions, (err, decoded) => {
      if (err) {
        reject(new AuthenticationError(err.message))
      } else {
        resolve(decoded)
      }
    })
  })
}

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`,
})

const getKey: jwt.GetPublicKeyOrSecret = (header, cb) => {
  if (!header.kid) {
    cb(new Error("No kid in JWT header"))
    return
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      cb(err)
    } else {
      // @ts-ignore
      const signingKey = key.publicKey || key.rsaPublicKey
      cb(null, signingKey)
    }
  })
}

const authClient = new AuthenticationClient({
  clientId: process.env.CLIENT_ID,
  domain: process.env.AUTH_DOMAIN || "",
})

export async function getUserInfo(token: string | null): Promise<UserInfo> {
  if (!token) {
    throw new AuthenticationError("No user token was provided")
  }

  return await authClient.getProfile(token)
}

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
