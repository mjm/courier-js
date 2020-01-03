import jwksClient from "jwks-rsa"
import * as jwt from "jsonwebtoken"
import { AuthenticationClient, ManagementClient, User } from "auth0"
import { AuthenticationError } from "apollo-server-core"
import { UserInfo, UserId, UserToken, UserAppMetadata } from "../data/types"
import Environment from "../env"
import { injectable, inject } from "inversify"
import { Token } from "../key"
import * as crypto from "crypto"

export type UserIdProvider = () => Promise<UserId>

export interface TwitterCredentials {
  access_token: string
  access_token_secret: string
}

@injectable()
class UserService {
  private jwtOptions: jwt.VerifyOptions
  private jwksClient: jwksClient.JwksClient
  private authClient: AuthenticationClient
  private managementClient: ManagementClient

  private authEncryptKey: Buffer

  private verifyPromise: Promise<UserToken>
  private userInfoPromise: Promise<UserInfo> | null = null

  constructor(@inject(Token) private token: string | null, env: Environment) {
    this.jwtOptions = {
      audience: env.apiIdentifier,
      issuer: `https://${env.authDomain}/`,
      algorithms: ["RS256"],
    }

    this.jwksClient = jwksClient({
      jwksUri: `https://${env.authDomain}/.well-known/jwks.json`,
    })

    this.authClient = new AuthenticationClient({
      clientId: env.clientId,
      domain: env.authDomain,
    })

    this.managementClient = new ManagementClient({
      domain: env.authDomain,
      clientId: env.backendClientId,
      clientSecret: env.backendClientSecret,
      scope:
        "read:users read:user_idp_tokens update:users_app_metadata update:users",
    })

    this.authEncryptKey = env.authEncryptKey

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

  async getUserId(): Promise<UserId | null> {
    try {
      const { sub } = await this.verify()
      return sub
    } catch (e) {
      // let this fail silently here
      // if resolvers need there to be a valid user, they will bubble the error
      return null
    }
  }

  async requireUserId(): Promise<UserId> {
    const { sub } = await this.verify()
    return sub
  }

  async getUserInfo(): Promise<UserInfo> {
    if (!this.userInfoPromise) {
      this.userInfoPromise = this.fetchUserInfo()
    }

    return this.userInfoPromise
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

  async getMicropubToken(
    userId: UserId | null,
    url: string
  ): Promise<string | null> {
    userId = userId || (await this.requireUserId())
    const user = await this.managementClient.getUser({ id: userId })

    if (!user.user_metadata || !user.user_metadata.micropub_tokens) {
      return null
    }

    url = url.replace(/\./g, "-")

    const tokens = user.user_metadata.micropub_tokens as Record<string, string>
    const token = tokens[url]
    if (!token) {
      return null
    }

    const tokenBuffer = Buffer.from(token, "hex")
    const iv = tokenBuffer.slice(0, 16)
    const encryptedToken = tokenBuffer.slice(16)
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      this.authEncryptKey,
      iv
    )

    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      decipher.on("readable", () => {
        let chunk: Buffer | null
        while (null !== (chunk = decipher.read())) {
          chunks.push(chunk)
        }
      })
      decipher.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf8"))
      })
      decipher.on("error", err => {
        reject(err)
      })
      decipher.write(encryptedToken)
      decipher.end()
    })
  }

  async getMetadataForUser(userId: UserId): Promise<UserAppMetadata> {
    const user = await this.managementClient.getUser({ id: userId })
    return (user.app_metadata || {}) as UserAppMetadata
  }

  async setMicropubToken(
    userId: UserId | null,
    url: string,
    token: string
  ): Promise<void> {
    userId = userId || (await this.requireUserId())

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", this.authEncryptKey, iv)

    const encryptedToken = await new Promise<string>((resolve, reject) => {
      // include the iv at the beginning of the encrypted token
      const chunks: Buffer[] = [iv]
      cipher.on("readable", () => {
        let chunk: Buffer | null
        while (null !== (chunk = cipher.read())) {
          chunks.push(chunk)
        }
      })
      cipher.on("end", () => {
        resolve(Buffer.concat(chunks).toString("hex"))
      })
      cipher.on("error", err => {
        reject(err)
      })
      cipher.write(token)
      cipher.end()
    })

    const user = await this.managementClient.getUser({ id: userId })
    const tokens =
      (user.user_metadata && user.user_metadata.micropub_tokens) || {}

    url = url.replace(/\./g, "-")

    await this.managementClient.updateUserMetadata(
      { id: userId },
      {
        micropub_tokens: {
          ...tokens,
          [url]: encryptedToken,
        },
      }
    )
  }

  async update(metadata: UserAppMetadata): Promise<any> {
    return await this.managementClient.updateAppMetadata(
      { id: await this.requireUserId() },
      metadata
    )
  }

  async findBySubscriptionId(id: string): Promise<User> {
    const users = await this.managementClient.getUsers({
      q: `app_metadata.stripe_subscription_id:"${id}"`,
    })
    if (!users.length) {
      throw new Error(`Could not find a user for subscription ${id}`)
    }

    return users[0]
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
      } else if ("publicKey" in key) {
        cb(null, key.publicKey)
      } else if ("rsaPublicKey" in key) {
        cb(null, key.rsaPublicKey)
      } else {
        cb(new Error("unrecognized key type"))
      }
    })
  }

  private async fetchUserInfo(): Promise<UserInfo> {
    if (!this.token) {
      throw new AuthenticationError("No user token was provided")
    }

    const profile = await this.authClient.getProfile(this.token)
    const token = await this.verify()
    return {
      ...profile,
      stripe_customer_id: token["https://courier.blog/customer_id"],
      stripe_subscription_id: token["https://courier.blog/subscription_id"],
      subscription_status: token["https://courier.blog/status"],
      micropub_sites: token["https://courier.blog/micropub_sites"],
    }
  }
}

export default UserService
