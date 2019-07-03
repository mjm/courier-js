import { MutationResolvers } from "../generated/graphql"
import { cancelTweet, uncancelTweet, postTweet, editTweet } from "../data/tweet"

export const Mutation: MutationResolvers = {
  async addFeed(_, { input }, { feeds }) {
    return { feed: await feeds.subscribe(input.url) }
  },

  async refreshFeed(_, { input }, { getUser, feeds }) {
    await getUser()
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

  async cancelTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await cancelTweet(sub, input.id) }
  },

  async uncancelTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await uncancelTweet(sub, input.id) }
  },

  async postTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()

    const { id, body, mediaURLs } = input
    if (body) {
      await editTweet(sub, {
        id,
        body,
        mediaURLs: mediaURLs || undefined,
      })
    }

    return { tweet: await postTweet(sub, input.id) }
  },

  async editTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await editTweet(sub, input) }
  },
}
