import { MutationResolvers } from "../generated/graphql"
import { createFeed } from "../data/feed"

export const Mutation: MutationResolvers = {
  async createFeed(_, { feed }) {
    return await createFeed(feed)
  },
}
