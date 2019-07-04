import jwksClient from "jwks-rsa"
import * as jwt from "jsonwebtoken"
import { AuthenticationClient, ManagementClient } from "auth0"
import { AuthenticationError } from "apollo-server-core"
import { UserInfo, UserId, UserToken } from "../data/types"

export interface TwitterCredentials {
  access_token: string
  access_token_secret: string
}

class UserService {
  private jwtOptions: jwt.VerifyOptions
  private jwksClient: jwksClient.JwksClient
  private authClient: AuthenticationClient
  private managementClient: ManagementClient

  private verifyPromise: Promise<UserToken>

  constructor(
    private token: string | null,
    authDomain: string,
    apiIdentifier: string,
    clientId: string,
    backendClientId: string,
    backendClientSecret: string
  ) {
    this.jwtOptions = {
      audience: apiIdentifier,
      issuer: `https://${authDomain}/`,
      algorithms: ["RS256"],
    }

    this.jwksClient = jwksClient({
      jwksUri: `https://${authDomain}/.well-known/jwks.json`,
    })

    this.authClient = new AuthenticationClient({
      clientId,
      domain: authDomain,
    })

    this.managementClient = new ManagementClient({
      domain: authDomain,
      clientId: backendClientId,
      clientSecret: backendClientSecret,
      scope: "read:users read:user_idp_tokens",
    })

    // Hang on to the promise of doing this verification once
    this.verifyPromise = this.doVerify()

    // Catch the error here. Other uses of verify may do something with it,
    // but if we don't catch it here, it'll be treated as an unhandled rejection
    // and make everyone sad.
    this.verifyPromise.catch(() => null)
  }

  async verify(): Promise<UserToken> {
    return await this.verifyPromise
  }

  async getUserId(): Promise<string | null> {
    try {
      const { sub } = await this.verify()
      return sub
    } catch (e) {
      // let this fail silently here
      // if resolvers need there to be a valid user, they will bubble the error
      return null
    }
  }

  async getUserInfo(): Promise<UserInfo> {
    if (!this.token) {
      throw new AuthenticationError("No user token was provided")
    }

    return await this.authClient.getProfile(this.token)
  }

  async getTwitterCredentials(userId: UserId): Promise<TwitterCredentials> {
    const user = await this.managementClient.getUser({ id: userId })
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

  private async doVerify(): Promise<UserToken> {
    const token = this.token
    if (!token) {
      throw new AuthenticationError(
        "No token was provided in Authorization header"
      )
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, this.getKey, this.jwtOptions, (err, decoded) => {
        if (err) {
          reject(new AuthenticationError(err.message))
        } else {
          resolve(decoded as UserToken)
        }
      })
    })
  }

  private getKey: jwt.GetPublicKeyOrSecret = (header, cb) => {
    if (!header.kid) {
      cb(new Error("No kid in JWT header"))
      return
    }

    this.jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        cb(err)
      } else {
        const signingKey = key.publicKey || key.rsaPublicKey
        cb(null, signingKey)
      }
    })
  }
}

export default UserService
