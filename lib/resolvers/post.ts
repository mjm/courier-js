import { PostResolvers } from "../generated/graphql"
import { toExternalId, IdPrefix } from "lib/data/id"

export const Post: PostResolvers = {
  id({ id }) {
    return toExternalId(IdPrefix.Post, id)
  },

  async feed({ feedId }, {}, { loaders }) {
    return (await loaders.feeds.load(feedId))!
  },
}
