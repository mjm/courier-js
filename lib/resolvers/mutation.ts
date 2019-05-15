import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed, deleteFeed } from "../data/feed"
import { cancelTweet } from "../data/tweet"

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
}
