import { MutationResolvers } from "../generated/graphql"
import { addFeed, refreshFeed } from "../data/feed"

export const Mutation: MutationResolvers = {
  async addFeed(_, { feed }) {
    return await addFeed(feed)
  },

  async refreshFeed(_, { id }) {
    return await refreshFeed(id)
  },
}
