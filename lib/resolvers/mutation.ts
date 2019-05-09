import { MutationResolvers } from "../generated/graphql"
import { addFeed } from "../data/feed"

export const Mutation: MutationResolvers = {
  async addFeed(_, { feed }) {
    return await addFeed(feed)
  },
}
