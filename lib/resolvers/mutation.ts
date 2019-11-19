import { MutationResolvers, TestNotificationType } from "../generated/graphql"

export const Mutation: MutationResolvers = {
  async addFeed(_, { input }, { feeds }) {
    return { feed: await feeds.subscribe(input.url) }
  },

  async refreshFeed(_, { input }, { user, feeds }) {
    await user.verify()
    return { feed: await feeds.refresh(input.id) }
  },

  async setFeedOptions(_, { input }, { feeds }) {
    const { id, ...options } = input
    return { feed: await feeds.updateOptions(id, options) }
  },

  async deleteFeed(_, { input }, { feeds }) {
    await feeds.unsubscribe(input.id)
    return { id: input.id }
  },

  async cancelTweet(_, { input }, { tweets }) {
    return { tweet: await tweets.cancel(input.id) }
  },

  async uncancelTweet(_, { input }, { tweets }) {
    return { tweet: await tweets.uncancel(input.id) }
  },

  async postTweet(_, { input }, { tweets }) {
    const { id, body, mediaURLs } = input
    if (body) {
      await tweets.update(id, { body, mediaURLs: mediaURLs || undefined })
    }

    return { tweet: await tweets.post(input.id) }
  },

  async editTweet(_, { input }, { tweets }) {
    const { id, ...changes } = input
    return { tweet: await tweets.update(id, changes) }
  },

  async subscribe(_, { input }, { billing, user }) {
    const { email, tokenID } = input
    await billing.subscribe(email, tokenID)
    return { user: await user.getUserInfo() }
  },

  async cancelSubscription(_, {}, { billing, user }) {
    await billing.cancel()
    return { user: await user.getUserInfo() }
  },

  async addDevice(_, { input }, { notifications }) {
    return { deviceToken: await notifications.addDevice(input) }
  },

  async sendTestNotification(_, { input }, { loaders, notifications, user }) {
    const tweet = await loaders.tweets.load(input.tweetId)
    if (!tweet) {
      throw new Error("Tweet could not be found")
    }

    const userId = await user.requireUserId()
    if (input.type === TestNotificationType.Imported) {
      await notifications.sendTweetImported(userId, tweet)
    } else {
      await notifications.sendTweetPosted(userId, tweet)
    }
    return {}
  },
}
