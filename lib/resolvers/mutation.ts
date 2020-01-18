import { MutationResolvers, TestNotificationType } from "../generated/graphql"
import { fromExternalId, IdPrefix } from "lib/data/id"

export const Mutation: MutationResolvers = {
  async addFeed(_, { input }, { feeds }) {
    const edge = await feeds.subscribe(input.url)
    return {
      feed: edge.node,
      feedEdge: edge,
    }
  },

  async refreshFeed(_, { input }, { user, feeds }) {
    await user.verify()
    return {
      feed: await feeds.refresh(fromExternalId(input.id, IdPrefix.Feed)),
    }
  },

  async setFeedOptions(_, { input }, { feeds }) {
    const { id, ...options } = input
    return {
      feed: await feeds.updateOptions(
        fromExternalId(id, IdPrefix.FeedSubscription),
        options
      ),
    }
  },

  async deleteFeed(_, { input }, { feeds }) {
    const id = fromExternalId(input.id, IdPrefix.FeedSubscription)
    await feeds.unsubscribe(id)
    return { id }
  },

  async cancelTweet(_, { input }, { tweets }) {
    const id = fromExternalId(input.id, IdPrefix.Tweet)
    return { tweet: await tweets.cancel(id) }
  },

  async uncancelTweet(_, { input }, { tweets }) {
    const id = fromExternalId(input.id, IdPrefix.Tweet)
    return { tweet: await tweets.uncancel(id) }
  },

  async postTweet(_, { input }, { tweets }) {
    const { body, mediaURLs } = input
    const id = fromExternalId(input.id, IdPrefix.Tweet)
    if (body) {
      await tweets.update(id, {
        body,
        mediaURLs: mediaURLs || undefined,
      })
    }

    return { tweet: await tweets.post(id) }
  },

  async editTweet(_, { input }, { tweets }) {
    const { id, ...changes } = input
    return {
      tweet: await tweets.update(fromExternalId(id, IdPrefix.Tweet), changes),
    }
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
    const { environment, ...rest } = input
    return {
      deviceToken: await notifications.addDevice({
        environment: environment || "SANDBOX",
        ...rest,
      }),
    }
  },

  async sendTestNotification(_, { input }, { loaders, notifications, user }) {
    const tweetId = fromExternalId(input.tweetId, IdPrefix.Tweet)
    const tweet = await loaders.tweets.load(tweetId)
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
