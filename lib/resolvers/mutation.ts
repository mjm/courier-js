import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed, deleteFeed } from "../data/feed"

export const Mutation: MutationResolvers = {
  async addFeed(_, { feed }) {
    return await addFeed(feed)
  },

  async refreshFeed(_, { id }) {
    return await refreshFeed(id)
  },

  async deleteFeed(_, { id }) {
    await deleteFeed(id)
    return id
  },
}
