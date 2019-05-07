import { ContextFunction, AuthenticationError } from "apollo-server-core"
import jwksClient from "jwks-rsa"
import * as jwt from "jsonwebtoken"

const context: ContextFunction = ({ req }) => {
  const token = getToken(req.headers)

  return {
    async getUser(): Promise<any> {
      return await verify(token)
    },
  }
}

export default context

function getToken(headers: { [key: string]: string }): string | null {
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
  audience: process.env.CLIENT_ID,
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ["RS256"],
}

async function verify(token: string | null): Promise<any> {
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
