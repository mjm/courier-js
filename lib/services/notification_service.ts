import { inject, injectable } from "inversify"

import DeviceTokenRepository from "@repositories/device_token_repository"
import PushNotificationProvider, { Device, Notification } from "lib/apns"
import { DeviceToken, NewDeviceTokenInput, Tweet, UserId } from "lib/data/types"
import * as keys from "lib/key"

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

  /**
   * Send a notification to the user's devices telling them that one or more
   * tweets were imported for them.
   *
   * @param userId The ID of the user the tweets are for.
   * @param tweets The list of tweets that were imported.
   * @param autopost Whether the tweets will be autoposted soon.
   */
  async sendTweetsImported(
    userId: UserId,
    tweets: Tweet[],
    autopost: boolean
  ): Promise<void> {
    if (!tweets.length) {
      return
    }

    const tokens = await this.getUserDevices(userId)
    if (!tokens.length) {
      return
    }

    const note: Notification =
      tweets.length === 1
        ? {
            title: {
              key: tweets[0].postAfter
                ? "IMPORTED_TWEET_TITLE_AUTOPOST"
                : "IMPORTED_TWEET_TITLE_NO_AUTOPOST",
            },
            body: tweets[0].body,
            topic: appBundleId,
            threadId: tweets[0].id,
            category: "IMPORTED_TWEET",
            appData: {
              tweetId: tweets[0].id,
            },
          }
        : {
            title: {
              key: autopost
                ? "IMPORTED_TWEETS_AUTOPOST"
                : "IMPORTED_TWEETS_NO_AUTOPOST",
              args: [tweets.length.toString()],
            },
            body: "",
            topic: appBundleId,
            category: "IMPORTED_TWEET",
          }
    await this.push.deliver(tokens, note)
  }

  async sendTweetImported(userId: UserId, tweet: Tweet): Promise<void> {
    const tokens = await this.getUserDevices(userId)
    if (!tokens.length) {
      return
    }

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

  private async getUserDevices(userId: UserId): Promise<Device[]> {
    const deviceTokens = await this.deviceTokens.findAllByUser(userId)
    return deviceTokens.map(token => ({
      token: Buffer.from(token.token, "base64").toString("hex"),
      environment: token.environment,
    }))
  }
}

export default NotificationService
