import { injectable, inject } from "inversify"
import DeviceTokenRepository from "../repositories/device_token_repository"
import { NewDeviceTokenInput, UserId, DeviceToken, Tweet } from "../data/types"
import * as keys from "../key"
import PushNotificationProvider from "../apns"

const appBundleId = "com.mattmoriarity.Courier"

@injectable()
class NotificationService {
  constructor(
    private deviceTokens: DeviceTokenRepository,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>,
    private push: PushNotificationProvider
  ) {}

  async addDevice(input: NewDeviceTokenInput): Promise<DeviceToken> {
    return await this.deviceTokens.create(await this.getUserId(), input)
  }

  async sendTweetImported(userId: UserId, tweet: Tweet): Promise<void> {
    const tokens = await this.getUserDevices(userId)
    if (!tokens.length) {
      return
    }

    /*
      A new tweet is ready to post

      My tweet body here
    */

    /*
      A new tweet will be automatically posted soon
    */

    await this.push.deliver(tokens, {
      title: {
        key: tweet.postAfter
          ? "IMPORTED_TWEET_TITLE_AUTOPOST"
          : "IMPORTED_TWEET_TITLE_NO_AUTOPOST",
      },
      body: tweet.body,
      topic: appBundleId,
      threadId: tweet.id,
      category: "IMPORTED_TWEET",
      appData: {
        tweetId: tweet.id,
      },
    })
  }

  async sendTweetPosted(userId: UserId, tweet: Tweet): Promise<void> {
    const tokens = await this.getUserDevices(userId)
    if (!tokens.length) {
      return
    }

    await this.push.deliver(tokens, {
      title: {
        key: "POSTED_TWEET_TITLE",
      },
      body: tweet.body,
      topic: appBundleId,
      threadId: tweet.id,
      category: "POSTED_TWEET",
      appData: {
        tweetId: tweet.id,
      },
    })
  }

  private async getUserDevices(userId: UserId): Promise<string[]> {
    const deviceTokens = await this.deviceTokens.findAllByUser(userId)
    return deviceTokens.map(token =>
      Buffer.from(token.token, "base64").toString("hex")
    )
  }
}

export default NotificationService
