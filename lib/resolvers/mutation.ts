import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed, deleteFeed } from "../data/feed"
import { cancelTweet, uncancelTweet, postTweet, editTweet } from "../data/tweet"

export const Mutation: MutationResolvers = {
  async addFeed(_, { feed }, { getUser }) {
    const { sub } = await getUser()
    return await addFeed({ ...feed, userId: sub })
  },

  async refreshFeed(_, { id }, { getUser }) {
    await getUser()
    return await refreshFeed(id)
  },

  async deleteFeed(_, { id }, { getUser }) {
    const { sub } = await getUser()
    await deleteFeed(sub, id)
    return id
  },

  async cancelTweet(_, { id }, { getUser }) {
    const { sub } = await getUser()
    return await cancelTweet(sub, id)
  },

  async uncancelTweet(_, { id }, { getUser }) {
    const { sub } = await getUser()
    return await uncancelTweet(sub, id)
  },

  async postTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()

    if (input.body) {
      await editTweet(sub, { id: input.id, body: input.body })
    }

    return { tweet: await postTweet(sub, input.id) }
  },

  async editTweet(_, { input }, { getUser }) {
    const { sub } = await getUser()
    return { tweet: await editTweet(sub, input) }
  },
}
