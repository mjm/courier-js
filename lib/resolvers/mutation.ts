import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed, deleteFeed } from "../data/feed"

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
    // TODO ensure the subscription belongs to the user
    await getUser()
    await deleteFeed(id)
    return id
  },
}
