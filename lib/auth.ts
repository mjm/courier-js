import jwksClient from "jwks-rsa"
import * as jwt from "jsonwebtoken"
import { AuthenticationError } from "apollo-server-core"
import { IncomingHttpHeaders } from "http"

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
      const signingKey = key.publicKey || key.rsaPublicKey
      cb(null, signingKey)
    }
  })
}
